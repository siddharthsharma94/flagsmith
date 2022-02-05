import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, customFeature:string) => `fs := flagsmith.DefaultClient("${envId}")
// Check for a feature
enabled, err := fs.FeatureEnabled("${data.FEATURE_NAME}")
if err != nil {
    log.Fatal(err)
} else {
    if (enabled) {
        ${data.FEATURE_FUNCTION}()
    }
}

// Or, use the value of a feature
feature_value, err := fs.GetValue("${data.FEATURE_NAME_ALT}")
if err != nil {
    log.Fatal(err)
} else {
    fmt.Printf(feature_value)
}`;

module.exports = res;
