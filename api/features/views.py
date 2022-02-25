import logging

import coreapi
from app_analytics.influxdb_wrapper import get_multiple_event_list_for_feature
from core.serializers import EmptySerializer
from django.conf import settings
from django.core.cache import caches
from django.db.models import Max, Q, QuerySet
from django.utils.decorators import method_decorator
from drf_yasg2 import openapi
from drf_yasg2.utils import swagger_auto_schema
from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from rest_framework.schemas import AutoSchema

from api.serializers import ErrorSerializer
from audit.models import (
    IDENTITY_FEATURE_STATE_DELETED_MESSAGE,
    AuditLog,
    RelatedObjectType,
)
from environments.authentication import EnvironmentKeyAuthentication
from environments.identities.models import Identity
from environments.models import Environment
from environments.permissions.permissions import (
    EnvironmentKeyPermissions,
    NestedEnvironmentPermissions,
)

from .constants import COMMITTED
from .models import Feature, FeatureState
from .permissions import (
    EnvironmentFeatureStatePermissions,
    FeaturePermissions,
    FeatureStatePermissions,
    IdentityFeatureStatePermissions,
)
from .serializers import (
    FeatureInfluxDataSerializer,
    FeatureOwnerInputSerializer,
    FeatureStateSerializerBasic,
    FeatureStateSerializerCreate,
    FeatureStateSerializerFull,
    FeatureStateSerializerWithIdentity,
    FeatureStateValueSerializer,
    GetInfluxDataQuerySerializer,
    ListCreateFeatureSerializer,
    ProjectFeatureSerializer,
    UpdateFeatureSerializer,
    WritableNestedFeatureStateSerializer,
)

logger = logging.getLogger()
logger.setLevel(logging.INFO)

flags_cache = caches[settings.FLAGS_CACHE_LOCATION]


class FeatureViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, FeaturePermissions]
    filterset_fields = ["is_archived"]

    def get_serializer_class(self):
        return {
            "list": ListCreateFeatureSerializer,
            "create": ListCreateFeatureSerializer,
            "update": UpdateFeatureSerializer,
            "partial_update": UpdateFeatureSerializer,
        }.get(self.action, ProjectFeatureSerializer)

    @swagger_auto_schema(
        request_body=FeatureOwnerInputSerializer,
        responses={200: ProjectFeatureSerializer},
    )
    @action(detail=True, methods=["POST"], url_path="add-owners")
    def add_owners(self, request, *args, **kwargs):
        serializer = FeatureOwnerInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        feature = self.get_object()
        serializer.add_owners(feature)
        return Response(self.get_serializer(instance=feature).data)

    @swagger_auto_schema(
        request_body=FeatureOwnerInputSerializer,
        responses={200: ProjectFeatureSerializer},
    )
    @action(detail=True, methods=["POST"], url_path="remove-owners")
    def remove_owners(self, request, *args, **kwargs):
        serializer = FeatureOwnerInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        feature = self.get_object()
        serializer.remove_users(feature)

        return Response(self.get_serializer(instance=feature).data)

    def get_queryset(self):
        user_projects = self.request.user.get_permitted_projects(["VIEW_PROJECT"])
        project = get_object_or_404(user_projects, pk=self.kwargs["project_pk"])
        return project.features.all().prefetch_related("multivariate_options")

    def perform_create(self, serializer):
        serializer.save(
            project_id=self.kwargs.get("project_pk"), user=self.request.user
        )

    def perform_update(self, serializer):
        serializer.save(project_id=self.kwargs.get("project_pk"))

    @swagger_auto_schema(
        query_serializer=GetInfluxDataQuerySerializer(),
        responses={200: FeatureInfluxDataSerializer()},
    )
    @action(detail=True, methods=["GET"], url_path="influx-data")
    def get_influx_data(self, request, pk, project_pk):
        feature = get_object_or_404(Feature, pk=pk)

        query_serializer = GetInfluxDataQuerySerializer(data=request.query_params)
        query_serializer.is_valid(raise_exception=True)

        events_list = get_multiple_event_list_for_feature(
            feature_name=feature.name, **query_serializer.data
        )
        serializer = FeatureInfluxDataSerializer(instance={"events_list": events_list})
        return Response(serializer.data)


@method_decorator(
    name="list",
    decorator=swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                "feature",
                openapi.IN_QUERY,
                "ID of the feature to filter by.",
                required=False,
                type=openapi.TYPE_INTEGER,
            ),
            openapi.Parameter(
                "anyIdentity",
                openapi.IN_QUERY,
                "Pass any value to get results that have an identity override. "
                "Do not pass for default behaviour.",
                required=False,
                type=openapi.TYPE_STRING,
            ),
        ]
    ),
)
class BaseFeatureStateViewSet(viewsets.ModelViewSet):
    """
    View set to manage feature states. Nested beneath environments and environments + identities
    to allow for filtering on both.
    """

    permission_classes = [IsAuthenticated, NestedEnvironmentPermissions]

    # Override serializer class to show correct information in docs
    def get_serializer_class(self):
        if self.action == "list":
            return FeatureStateSerializerWithIdentity
        elif self.action in ["retrieve", "update", "create"]:
            return FeatureStateSerializerBasic
        else:
            return FeatureStateSerializerCreate

    def get_queryset(self):
        """
        Override queryset to filter based on provided URL parameters.
        """
        environment_api_key = self.kwargs["environment_api_key"]
        environment = get_object_or_404(
            self.request.user.get_permitted_environments(["VIEW_ENVIRONMENT"]),
            api_key=environment_api_key,
        )

        latest_versions_qs = (
            FeatureState.objects.filter(environment=environment, status=COMMITTED)
            .values("feature", "feature_segment", "identity")
            .annotate(max_version=Max("version"))
            .order_by()
        )
        q = Q(environment=environment)
        for latest_version_dict in latest_versions_qs:
            q = q | Q(
                feature_id=latest_version_dict["feature"],
                identity_id=latest_version_dict["identity"],
                feature_segment_id=latest_version_dict["feature_segment"],
                version=latest_version_dict["max_version"],
            )

        queryset = FeatureState.objects.filter(q)
        queryset = self._apply_query_param_filters(queryset)

        return queryset

    def _apply_query_param_filters(self, queryset: QuerySet) -> QuerySet:
        if "anyIdentity" in self.request.query_params:
            queryset = queryset.exclude(identity=None)
        if self.request.query_params.get("feature"):
            queryset = queryset.filter(
                feature__id=int(self.request.query_params.get("feature"))
            )
        return queryset

    def get_environment_from_request(self):
        """
        Get environment object from URL parameters in request.
        """
        environment = Environment.objects.get(
            api_key=self.kwargs["environment_api_key"]
        )
        return environment

    def get_identity_from_request(self, environment):
        """
        Get identity object from URL parameters in request.
        """
        identity = Identity.objects.get(pk=self.kwargs["identity_pk"])
        return identity

    def create(self, request, *args, **kwargs):
        """
        DEPRECATED: please use `/features/featurestates/` instead.
        Override create method to add environment and identity (if present) from URL parameters.
        """
        data = request.data
        environment = self.get_environment_from_request()
        if (
            environment.project.organisation
            not in self.request.user.organisations.all()
        ):
            return Response(status.HTTP_403_FORBIDDEN)

        data["environment"] = environment.id

        if "feature" not in data:
            error = {"detail": "Feature not provided"}
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

        feature_id = int(data["feature"])

        if feature_id not in [
            feature.id for feature in environment.project.features.all()
        ]:
            error = {"detail": "Feature does not exist in project"}
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

        identity_pk = self.kwargs.get("identity_pk")
        if identity_pk:
            data["identity"] = identity_pk

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            feature_state = serializer.save()
            headers = self.get_success_headers(serializer.data)

            if "feature_state_value" in data:
                self.update_feature_state_value(
                    data["feature_state_value"], feature_state
                )

            return Response(
                FeatureStateSerializerBasic(feature_state).data,
                status=status.HTTP_201_CREATED,
                headers=headers,
            )
        else:
            logger.error(serializer.errors)
            error = {"detail": "Couldn't create feature state."}
            return Response(error, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        """
        Override update method to always assume update request is partial and create / update
        feature state value.
        """
        feature_state_to_update = self.get_object()
        feature_state_data = request.data

        # Check if feature state value was provided with request data. If so, create / update
        # feature state value object and associate with feature state.
        if "feature_state_value" in feature_state_data:
            feature_state_value = self.update_feature_state_value(
                feature_state_data["feature_state_value"], feature_state_to_update
            )

            if isinstance(feature_state_value, Response):
                return feature_state_value

            feature_state_data["feature_state_value"] = feature_state_value.id

        serializer = self.get_serializer(
            feature_state_to_update, data=feature_state_data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if getattr(feature_state_to_update, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # refresh the instance from the database.
            feature_state_to_update = self.get_object()
            serializer = self.get_serializer(feature_state_to_update)

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        feature_state = get_object_or_404(self.get_queryset(), pk=kwargs.get("pk"))
        res = super(BaseFeatureStateViewSet, self).destroy(request, *args, **kwargs)
        if res.status_code == status.HTTP_204_NO_CONTENT:
            self._create_deleted_feature_state_audit_log(feature_state)
        return res

    def _create_deleted_feature_state_audit_log(self, feature_state):
        message = IDENTITY_FEATURE_STATE_DELETED_MESSAGE % (
            feature_state.feature.name,
            feature_state.identity.identifier,
        )

        AuditLog.objects.create(
            author=getattr(self.request, "user", None),
            related_object_id=feature_state.id,
            related_object_type=RelatedObjectType.FEATURE_STATE.name,
            environment=feature_state.environment,
            project=feature_state.environment.project,
            log=message,
        )

    def partial_update(self, request, *args, **kwargs):
        """
        Override partial_update as overridden update method assumes partial True for all requests.
        """
        return self.update(request, *args, **kwargs)

    def update_feature_state_value(self, value, feature_state):
        feature_state_value_dict = feature_state.generate_feature_state_value_data(
            value
        )

        if hasattr(feature_state, "feature_state_value"):
            feature_state_value_serializer = FeatureStateValueSerializer(
                instance=feature_state.feature_state_value,
                data=feature_state_value_dict,
            )
        else:
            data = {**feature_state_value_dict, "feature_state": feature_state.id}
            feature_state_value_serializer = FeatureStateValueSerializer(data=data)

        if feature_state_value_serializer.is_valid():
            feature_state_value = feature_state_value_serializer.save()
        else:
            return Response(
                feature_state_value_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )

        return feature_state_value


class EnvironmentFeatureStateViewSet(BaseFeatureStateViewSet):
    permission_classes = [IsAuthenticated, EnvironmentFeatureStatePermissions]

    def get_queryset(self):
        return super().get_queryset().filter(identity=None, feature_segment=None)

    def get_serializer_class(self):
        if self.action == "create_new_version":
            return FeatureStateSerializerBasic
        return super().get_serializer_class()

    @swagger_auto_schema(
        method="POST",
        request_body=EmptySerializer(),
        responses={201: FeatureStateSerializerBasic(), 400: ErrorSerializer()},
    )
    @action(detail=True, methods=["POST"], url_path="create-new-version")
    def create_new_version(self, *args, **kwargs) -> Response:
        current_version = self.get_object()
        new_version = current_version.create_new_version()
        return Response(
            self.get_serializer(instance=new_version).data,
            status=status.HTTP_201_CREATED,
        )


class IdentityFeatureStateViewSet(BaseFeatureStateViewSet):
    permission_classes = [IsAuthenticated, IdentityFeatureStatePermissions]

    def get_queryset(self):
        return super().get_queryset().filter(identity__pk=self.kwargs["identity_pk"])


class SimpleFeatureStateViewSet(
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
    queryset = FeatureState.objects.select_related("feature_state_value")
    serializer_class = WritableNestedFeatureStateSerializer
    permission_classes = [FeatureStatePermissions]
    filterset_fields = ["environment", "feature", "feature_segment"]

    def get_queryset(self):
        return self.queryset.filter(
            environment__in=self.request.user.get_permitted_environments(
                permissions=["VIEW_ENVIRONMENT"]
            )
        )


class SDKFeatureStates(GenericAPIView):
    serializer_class = FeatureStateSerializerFull
    permission_classes = (EnvironmentKeyPermissions,)
    authentication_classes = (EnvironmentKeyAuthentication,)
    renderer_classes = [JSONRenderer]

    schema = AutoSchema(
        manual_fields=[
            coreapi.Field(
                "X-Environment-Key",
                location="header",
                description="API Key for an Environment",
            ),
            coreapi.Field(
                "feature",
                location="query",
                description="Name of the feature to get the state of",
            ),
        ]
    )

    def get(self, request, identifier=None, *args, **kwargs):
        """
        USING THIS ENDPOINT WITH AN IDENTIFIER IS DEPRECATED.
        Please use `/identities/?identifier=<identifier>` instead.
        """
        if identifier:
            return self._get_flags_response_with_identifier(request, identifier)

        if "feature" in request.GET:
            feature_states = FeatureState.get_environment_flags(
                environment=request.environment, feature_name=request.GET["feature"]
            )
            if len(feature_states) != 1:
                # TODO: what if more than one?
                return Response(
                    {"detail": "Given feature not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(self.get_serializer(feature_states[0]).data)

        if settings.CACHE_FLAGS_SECONDS > 0:
            data = self._get_flags_from_cache(request.environment)
        else:
            data = self.get_serializer(
                FeatureState.get_environment_flags(environment=request.environment),
                many=True,
            ).data

        return Response(data)

    def _get_flags_from_cache(self, environment):
        data = flags_cache.get(environment.api_key)
        if not data:
            data = self.get_serializer(
                FeatureState.get_environment_flags(environment=environment), many=True
            ).data
            flags_cache.set(environment.api_key, data, settings.CACHE_FLAGS_SECONDS)

        return data

    def _get_flags_response_with_identifier(self, request, identifier):
        identity, _ = Identity.objects.get_or_create(
            identifier=identifier, environment=request.environment
        )

        kwargs = {
            "identity": identity,
            "environment": request.environment,
            "feature_segment": None,
        }

        if "feature" in request.GET:
            kwargs["feature__name__iexact"] = request.GET["feature"]
            try:
                feature_state = identity.get_all_feature_states().get(
                    feature__name__iexact=kwargs["feature__name__iexact"],
                )
            except FeatureState.DoesNotExist:
                return Response(
                    {"detail": "Given feature not found"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                self.get_serializer(feature_state).data, status=status.HTTP_200_OK
            )

        flags = self.get_serializer(identity.get_all_feature_states(), many=True)
        return Response(flags.data, status=status.HTTP_200_OK)


def organisation_has_got_feature(request, organisation):
    """
    Helper method to set flag against organisation to confirm that they've requested their
    feature states for analytics purposes

    :param request: HTTP request
    :return: True if value set. None otherwise.
    """
    if organisation.has_requested_features:
        return None

    referer = request.META.get("HTTP_REFERER")
    if not referer or "bullet-train.io" in referer:
        return None
    else:
        organisation.has_requested_features = True
        organisation.save()
        return True
