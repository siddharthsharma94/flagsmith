select
	"fs1"."id",
	"fs1"."feature_id",
	"fs1"."environment_id",
	"fs1"."identity_id",
	"fs1"."feature_segment_id",
	"fs1"."enabled",
	"fs1"."created_at",
	"fs1"."updated_at",
	"fs1"."version",
	"fs1"."status",
	"features_feature"."id",
	"features_feature"."name",
	"features_feature"."created_date",
	"features_feature"."project_id",
	"features_feature"."initial_value",
	"features_feature"."description",
	"features_feature"."default_enabled",
	"features_feature"."type",
	"features_feature"."is_archived",
	"environments_identity"."id",
	"environments_identity"."identifier",
	"environments_identity"."created_date",
	"environments_identity"."environment_id",
	"features_featuresegment"."id",
	"features_featuresegment"."feature_id",
	"features_featuresegment"."segment_id",
	"features_featuresegment"."environment_id",
	"features_featuresegment"."enabled",
	"features_featuresegment"."value",
	"features_featuresegment"."value_type",
	"features_featuresegment"."priority",
	"segments_segment"."id",
	"segments_segment"."name",
	"segments_segment"."description",
	"segments_segment"."project_id",
	"features_featurestatevalue"."id",
	"features_featurestatevalue"."type",
	"features_featurestatevalue"."boolean_value",
	"features_featurestatevalue"."integer_value",
	"features_featurestatevalue"."feature_state_id",
	"features_featurestatevalue"."string_value",
	"fs2"."id",
	"fs2"."version"
from
	"features_featurestate" "fs1"
left outer join "environments_identity" on
	("fs1"."identity_id" = "environments_identity"."id")
left outer join "features_featuresegment" on
	("fs1"."feature_segment_id" = "features_featuresegment"."id")
left outer join "segments_segment" on
	("features_featuresegment"."segment_id" = "segments_segment"."id")
inner join "features_feature" on
	("fs1"."feature_id" = "features_feature"."id")
left outer join "features_featurestatevalue" on
	("fs1"."id" = "features_featurestatevalue"."feature_state_id")
left outer join "features_featurestate" "fs2" on
	("fs1"."id" = "fs2"."id"
		and "fs1"."version" < "fs2"."version")
where
	("fs1"."environment_id" = %(environment_id)s
		and ("fs1"."identity_id" = %(identity_id)s
			or ("features_featuresegment"."environment_id" = %(environment_id)s
				and "features_featuresegment"."segment_id" in %(segment_ids)s)
				or ("fs1"."feature_segment_id" is null
					and "fs1"."identity_id" is null))
		and ("fs2"."id" is null)
	    and "fs1"."status" = 'COMMITTED')
order by
	"fs1"."id" asc