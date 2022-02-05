import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, userId:string) =>  `// This will create a user in the dashboard if they don't already exist
User user = new User();
user.setIdentifier("${userId || data.USER_ID}");

${data.LIB_NAME_JAVA} ${data.LIB_NAME} = ${data.LIB_NAME_JAVA}.newBuilder()
    .setApiKey("${envId}")
    .build();

boolean featureEnabled = ${data.LIB_NAME}.hasFeatureFlag("${data.FEATURE_NAME}", user);
if (featureEnabled) {
    // Run the code to execute enabled feature
} else {
    // Run the code if feature switched off
}

String myRemoteConfig = ${data.LIB_NAME}.getFeatureFlagValue("${data.FEATURE_NAME_ALT}", user);
if (myRemoteConfig != null) {
    // Run the code to use remote config value
} else {
    // Run the code without remote config
}
`;

module.exports = res;
