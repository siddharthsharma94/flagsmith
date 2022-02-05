import {codeHelpType} from "../code-help-type";
const res = (envId: string, data:codeHelpType, customFeature:string) => `require "flagsmith"
flagsmith = Flagsmith.new("${envId}")

// Check for a feature
if flagsmith.feature_enabled?("${data.FEATURE_NAME}")
end

// Or, use the value of a feature
if flagsmith.get_value("${data.FEATURE_NAME_ALT}")
end`;

module.exports = res;
