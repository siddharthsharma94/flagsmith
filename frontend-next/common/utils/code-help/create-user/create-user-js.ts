import {codeHelpType} from "../code-help-type";

const res = (envId: string, data:codeHelpType, userId:string) =>  `import ${data.LIB_NAME} from '${data.NPM_CLIENT}';

// Standard project initialisation
${data.LIB_NAME}.init({
    environmentID: "${envId}",
        onChange: (oldFlags, params) => { // Occurs whenever flags are changed
        // Determines if the update came from the server or local cached storage
        const { isFromServer } = params;

        // Check for a feature
        if (${data.LIB_NAME}.hasFeature("${data.USER_FEATURE_NAME}")) {
            ${data.USER_FEATURE_FUNCTION}();
        }

        // Or, use the value of a feature
        const ${data.USER_FEATURE_NAME} = ${data.LIB_NAME}.getValue("${data.USER_FEATURE_NAME}");

        // Check whether value has changed
        const ${data.USER_FEATURE_NAME}Old = oldFlags["${data.USER_FEATURE_NAME}"]
         && oldFlags["${data.USER_FEATURE_NAME}"].value;
        if (${data.USER_FEATURE_NAME} !== ${data.USER_FEATURE_NAME}Old) {
            // Value has changed, do something here
        }
    }
});
// This will create a user in the dashboard if they don't already exist
${data.LIB_NAME}.identify("${userId || data.USER_ID}");
`;

module.exports = res;
