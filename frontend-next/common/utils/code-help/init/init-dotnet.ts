import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, customFeature:string) => `
{
    ApiUrl = "https://api.flagsmith.com/api/v1/",
    EnvironmentKey = "${envId}"
};

BulletTrainClient bulletClient = new BulletTrainClient(configuration);
// Check for a feature
bool featureEnabled = await ${data.LIB_NAME}.HasFeatureFlag("${customFeature || data.FEATURE_NAME}");

// Or, use the value of a feature
string myRemoteConfig = await ${data.LIB_NAME}.GetFeatureValue("${customFeature || data.FEATURE_NAME_ALT}");
`;

module.exports = res;
