import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, customFeature:string) => `
curl 'https://api.flagsmith.com/api/v1/flags/' -H 'authority: api.bullet-train.io' -H 'x-environment-key: ${envId}' --compressed
`;

module.exports = res;
