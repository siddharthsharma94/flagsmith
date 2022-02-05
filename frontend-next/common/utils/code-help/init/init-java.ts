
import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, customFeature:string) => `${data.LIB_NAME_JAVA} ${data.LIB_NAME} = ${data.LIB_NAME_JAVA}.newBuilder()
    .setApiKey("${envId}")
    .build();

// Check for a feature
boolean featureEnabled = ${data.LIB_NAME}.hasFeatureFlag("${customFeature || data.FEATURE_NAME}");

// Or, use the value of a feature
String myRemoteConfig = ${data.LIB_NAME}.getFeatureFlagValue("${customFeature || data.FEATURE_NAME_ALT}");

`;

module.exports = res;
