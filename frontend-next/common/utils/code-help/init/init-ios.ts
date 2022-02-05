import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, customFeature:string) => `import FlagsmithClient

func application(_ application: UIApplication,
 didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

  Flagsmith.shared.apiKey = "${envId}"
  // Check for a feature
  Flagsmith.shared
  .hasFeatureFlag(withID: "${data.FEATURE_NAME}", forIdentity: nil) { (result) in
      print(result)
  }

  // Or, use the value of a feature
  Flagsmith.shared
  .getFeatureValue(withID: "${data.FEATURE_NAME_ALT}", forIdentity: nil) { (result) in
      switch result {
      case .success(let value):
          print(value ?? "nil")
      case .failure(let error):
          print(error)
      }
  }
}`;

module.exports = res;
