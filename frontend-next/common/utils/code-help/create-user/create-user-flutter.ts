import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, userId:string) =>  `final flagsmithClient = FlagsmithClient(
        apiKey: '${envId}' 
        config: config, 
        seeds: <Flag>[
            Flag.seed('feature', enabled: true),
        ],
    );

//if you prefer async initialization then you should use
//final flagsmithClient = await FlagsmithClient.init(
//        apiKey: 'YOUR_ENV_API_KEY',
//        config: config, 
//        seeds: <Flag>[
//            Flag.seed('feature', enabled: true),
//        ], 
//        update: false,
//    );

// This will create a user in the dashboard if they don't already exist
final user = FeatureUser(identifier: '${data.USER_ID}');

bool featureEnabled = await flagsmithClient
  .hasFeatureFlag('${data.FEATURE_NAME}', user: user);
  
final myRemoteConfig = await flagsmithClient
  .getFeatureFlagValue('${data.FEATURE_NAME_ALT}', user: user);

`;

module.exports = res;
