import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, customFeature:string) => `import ${data.LIB_NAME} from "${data.NPM_NODE_CLIENT}"; // Add this line if you're using ${data.LIB_NAME} via npm

${data.LIB_NAME}.init({
    environmentID: "${envId}"
});

// Check for a feature
${data.LIB_NAME}.hasFeature("${customFeature || data.FEATURE_NAME}")
    .then((featureEnabled) => {
        if (featureEnabled) {
           ${data.FEATURE_FUNCTION}();
        }
    });

// Or, use the value of a feature
${data.LIB_NAME}.getValue("${customFeature || data.FEATURE_NAME_ALT}")
    .then((value) => {
        // Show a value to the world
    });
`;

module.exports = res;
