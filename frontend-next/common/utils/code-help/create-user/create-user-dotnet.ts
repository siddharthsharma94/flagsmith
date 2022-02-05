import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, userId:string) => `BulletTrainConfiguration configuration = new BulletTrainConfiguration()
{
    ApiUrl = "https://api.flagsmith.com/api/v1/",
    EnvironmentKey = "${envId}"
};

// This will create a user in the dashboard if they don't already exist
BulletTrainClient bulletClient = new BulletTrainClient(configuration);

bool featureEnabled = await BulletTrainClient.instance
    .HasFeatureFlag("${data.FEATURE_NAME}", "${data.USER_ID}");
    
string myRemoteConfig = await BulletTrainClient.instance
    .GetFeatureValue("${data.FEATURE_NAME_ALT}", "${data.USER_ID}");

`;

module.exports = res;
