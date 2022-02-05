import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, customFeature:string) => `curl 'https://api.flagsmith.com/api/v1/flags/' -H 'X-Environment-Key: ${envId}'
`;

module.exports = res;
