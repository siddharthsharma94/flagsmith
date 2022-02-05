import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, userId:string) =>  `var testUser = flagsmith.User{Identifier: "${data.USER_ID}"}

c := flagsmith.DefaultClient("${envId}")

enabled, err := c.HasUserFeature(testUser, "${data.FEATURE_NAME}")

val, err := c.GetUserValue(testUser, ${data.FEATURE_NAME_ALT})

`;

module.exports = res;
