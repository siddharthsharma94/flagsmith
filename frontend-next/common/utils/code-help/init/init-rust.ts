import {codeHelpType} from "../code-help-type";
const res = (envId: string, data:codeHelpType, customFeature:string) => `let bt = bullettrain::Client::new("${envId}");

// Check for a feature
if bt.feature_enabled("${data.FEATURE_NAME}")? {
    println!("Feature enabled");
}

// Or, use the value of a feature
if let Some(Value::String(s)) = bt.get_value("${data.FEATURE_NAME_ALT}")? {
    println!("{}", s);
}
`;
