import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, userId:string) => `
// Identify / create user
curl 'https://api.flagsmith.com/api/v1/identities/?identifier=${userId}' -H 'authority: api.bullet-train.io' -H 'x-environment-key: ${envId}' --compressed
`;

module.exports = res;
