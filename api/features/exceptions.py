from rest_framework import status
from rest_framework.exceptions import APIException


class FeatureStateVersionAlreadyExists(APIException):
    status_code = status.HTTP_400_BAD_REQUEST

    def __init__(self, version: int):
        super(FeatureStateVersionAlreadyExists, self).__init__(
            f"Version {version} already exists for FeatureState."
        )
