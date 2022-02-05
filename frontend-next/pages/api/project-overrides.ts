import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from 'next'
const getVariable = ({ name, value }: {name:string, value?:string|boolean}) => {
    if (!value || value === 'undefined') {
        if (typeof value === 'boolean') {
            return `    ${name}: false,
                `;
        }
        return '';
    }

    if (typeof value !== 'string') {
        return `    ${name}: ${value},
            `;
    }

    return `    ${name}: '${value}',
        `;
};
let sha = '';
if (fs.existsSync(path.join(__dirname, 'CI_COMMIT_SHA'))) {
    sha = fs.readFileSync(path.join(__dirname, 'CI_COMMIT_SHA'), {encoding:"utf8"});
}

const envToBool = (name:string, defaultVal?:string|boolean) => {
    const envVar = `${process.env[name]}`;
    if (envVar === 'undefined') {
        return defaultVal;
    }
    return envVar === 'true' || envVar === '1';
};

export default async (req: NextApiRequest, res: NextApiResponse) => {

    const values = [
        { name: 'preventSignup', value: envToBool('PREVENT_SIGNUP', false) ||  !envToBool('ALLOW_SIGNUPS', true) }, // todo:  deprecate ALLOW_SIGNUPS
        { name: 'superUserCreateOnly', value: envToBool('ONLY_SUPERUSERS_CAN_CREATE_ORGANISATIONS', false) },
        { name: 'flagsmith', value: process.env.FLAGSMITH_ON_FLAGSMITH_API_KEY },
        { name: 'heap', value: process.env.HEAP_API_KEY },
        { name: 'ga', value: process.env.GOOGLE_ANALYTICS_API_KEY },
        { name: 'crispChat', value: process.env.CRISP_WEBSITE_ID },
        { name: 'sha', value: sha },
        { name: 'mixpanel', value: process.env.MIXPANEL_API_KEY },
        { name: 'sentry', value: process.env.SENTRY_API_KEY },
        { name: 'api', value: process.env.FLAGSMITH_PROXY_API_URL ? '/api/v1/' : process.env.FLAGSMITH_API_URL },
        { name: 'maintenance', value: process.env.ENABLE_MAINTENANCE_MODE },
        { name: 'assetURL', value: process.env.STATIC_ASSET_CDN_URL },
        { name: 'flagsmithClientAPI', value: process.env.FLAGSMITH_ON_FLAGSMITH_API_URL },
        { name: 'disableInflux', value: !envToBool('ENABLE_INFLUXDB_FEATURES', true) },
        { name: 'flagsmithAnalytics', value: envToBool('ENABLE_FLAG_EVALUATION_ANALYTICS', true) },
        { name: 'amplitude', value: process.env.AMPLITUDE_API_KEY },
        { name: 'delighted', value: process.env.DELIGHTED_API_KEY },
        { name: 'capterraKey', value: process.env.CAPTERRA_API_KEY },
    ];
    const output = values.map(getVariable).join('');

    res.setHeader('content-type', 'application/javascript');
    res.send(`window.projectOverrides = {
        ${output}
    };
    `);
}
