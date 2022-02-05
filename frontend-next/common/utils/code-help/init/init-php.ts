
import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, customFeature:string) => `use Flagsmith\\Flagsmith;

$bt = new Flagsmith('${envId}');

// Check for a feature
$${data.FEATURE_NAME} = $bt->featureEnabled("${data.FEATURE_NAME}");

// Or, use the value of a feature
$${data.FEATURE_NAME_ALT} = $bt->getValue("${data.FEATURE_NAME_ALT}");
`;

module.exports = res;

