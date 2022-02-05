import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, customFeature:string) => `import ${data.LIB_NAME} from "${data.NPM_CLIENT}"; //Add this line if you're using ${data.LIB_NAME} via npm

${data.LIB_NAME}.init({
    environmentID:"${envId}",
    onChange: (oldFlags, params) => { // Occurs whenever flags are changed
        // Determines if the update came from the server or local cached storage
        const { isFromServer } = params; 

        // Check for a feature
        if (${data.LIB_NAME}.hasFeature("${customFeature || data.FEATURE_NAME}")) {
            ${data.FEATURE_FUNCTION}();
        }

        // Or, use the value of a feature
        const ${data.FEATURE_NAME_ALT} = ${data.LIB_NAME}.getValue("${customFeature || data.FEATURE_NAME_ALT}");

        // Check whether value has changed
        const ${data.FEATURE_NAME_ALT}Old = oldFlags["${customFeature || data.FEATURE_NAME_ALT}"] 
        && oldFlags["${customFeature || data.FEATURE_NAME_ALT}"].value;
        
        if (${data.FEATURE_NAME_ALT} !== ${data.FEATURE_NAME_ALT}Old) {
            // Value has changed, do something here
        }
    }
});
`;

module.exports = res;
