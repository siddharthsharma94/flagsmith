
import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, customFeature:string) => `from flagsmith import Flagsmith;

flagsmith = Flagsmith(environment_id="${envId}")

# This will create a user in the dashboard if they don't already exist
# Check for a feature
if flagsmith.has_feature("${data.FEATURE_NAME}"):
  if flagsmith.feature_enabled("${data.FEATURE_NAME}"):
    # Show my awesome cool new feature to the world

# Or, use the value of a feature
value = flagsmith.get_value("${data.FEATURE_NAME_ALT}")
`;

module.exports = res;


