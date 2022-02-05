const fs = require('fs');
const path = require('path');

const rootPath = path.join(__dirname, '../../../');
const common = path.join(rootPath, './common');
const appActions = path.join(common, './app-actions.ts');
const saga = path.join(common, './saga.ts');
const reducer = path.join(common, './reducer.ts');
const stateTypes = path.join(common, './state-type.ts');
const providers = path.join(common, './providers');
const mobileScreens = path.join(rootPath, './mobile/app/screens');
const mobileRoutes = path.join(rootPath, './mobile/app/navigation/AppNavigator.tsx');
const routes = path.join(rootPath, './mobile/app/routes.tsx');
const routeUrls = path.join(rootPath, './mobile/app/route-urls.ts');

const stateTypesPointer = '// END OF STATE_TYPES';
const actionsPointer = '// END OF APP_ACTIONS';
const stringsPointer = '// END OF ACTION_STRINGS';
const yieldPointer = '// END OF YIELDS';
const takeLatestPointer = '// END OF TAKE_LATEST';
const routeUrlsPointer = '// END OF SCREENS';
const routesImportPointer = '// END OF IMPORT';
const mobileRoutesPointer = '{/* END OF ROUTES*/}';
const routesScreensPointer = '// END OF SCREENS';
const requestStateTypesPointer = '// END OF REQUEST_TYPES';
const reducerPointer = '// END OF REDUCER';

const functionName = function (action, prefix) {
    const post = prefix.charAt(0).toUpperCase() + prefix.slice(1);
    const actionParts = action.split('_');
    return actionParts[0].toLowerCase() + post;
};

module.exports = {
    async writeActions(strings, action) {
        let res = fs.readFileSync(appActions, 'utf8');

        if (res.includes(strings)) {
            console.log('Skipping action strings, already exists');
        } else {
            res = res.replace(stringsPointer, `${strings}\n${stringsPointer}`);
        }
        if (res.includes(action)) {
            console.log('Skipping actions, already exists');
        } else {
            res = res.replace(actionsPointer, `${action}\n${actionsPointer}`);
        }
        return fs.writeFileSync(appActions, res, 'utf8');
    },
    async writeSaga(yieldString, takeLatest) {
        let res = fs.readFileSync(saga, 'utf8');
        if (res.includes(yieldString)) {
            console.log('Skipping yield string, already exists');
        } else {
            res = res.replace(yieldPointer, `${yieldString}\n${yieldPointer}`);
        }
        if (res.includes(takeLatest)) {
            console.log('Skipping latest string, already exists');
        } else {
            res = res.replace(takeLatestPointer, `${takeLatest}\n    ${takeLatestPointer}`);
        }
        return fs.writeFileSync(saga, res, 'utf8');
    },
    async writeReducer(reducerString, stateTypesString, requestStateTypesString) {
        let res = fs.readFileSync(reducer, 'utf8');
        if (res.includes(reducerString)) {
            console.log('Reducer string, already exists');
        } else {
            res = res.replace(reducerPointer, `${reducerString}\n    ${reducerPointer}`);
        }

        if (stateTypes) {
            console.log("STATE TYPES")
            let res2 = fs.readFileSync(stateTypes, 'utf8');

            if (res2.includes(requestStateTypesString)) {
                console.log('request state types string, already exists');
            } else {
                res2 = res2.replace(requestStateTypesPointer, `${requestStateTypesString}\n  ${requestStateTypesPointer}`);
                fs.writeFileSync(stateTypes, res2, 'utf8')
            }
            if (res2.includes(stateTypesString)) {
                console.log('state types string, already exists');
            } else {
                res2 = res2.replace(stateTypesPointer, `${stateTypesString}\n  ${stateTypesPointer}`);
                fs.writeFileSync(stateTypes, res2, 'utf8')
            }
        }

        return fs.writeFileSync(reducer, res, 'utf8');
    },
    async writeProvider(providerString, prefix) {
        const providerPath = path.join(providers, `${functionName('USE', prefix)}.ts`);
        const res = fs.existsSync(providerPath);
        if (res) {
            console.log('Skipping provider, already exists');
        } else {
            return fs.writeFileSync(providerPath, providerString, 'utf8');
        }
    },
    async writeRouteUrl(urlString) {
        let res = fs.readFileSync(routeUrls, 'utf8');

        if (res.includes(urlString)) {
            console.log('url string, already exists');
        } else {
            res = res.replace(routeUrlsPointer, `${urlString}\n  ${routeUrlsPointer}`);
            fs.writeFileSync(routeUrls, res, 'utf8')
        }
    },
    async writeRoute(importString, screenString) {
        let res = fs.readFileSync(routes, 'utf8');

        if (res.includes(importString)) {
            console.log('Route import routes string already exists');
        } else {
            res = res.replace(routesImportPointer, `${importString}\n${routesImportPointer}`);
        }
        if (res.includes(screenString)) {
            console.log('Route screen string already exists');
        } else {
            res = res.replace(routesScreensPointer, `${screenString}\n  ${routesScreensPointer}`);
        }
        fs.writeFileSync(routes, res, 'utf8')
    },
    async writeScreenComponent(name, screenString) {
        const filePath = path.join(mobileScreens, `${name}.tsx`);
        const res = fs.existsSync(filePath);
        if (res) {
            console.log('Skipping screen component already exists');
        } else {
            return fs.writeFileSync(filePath, screenString, 'utf8');
        }
    },
    async writeAppRouteComponent(appRouteString) {
        console.log(mobileRoutes)
        let res = fs.readFileSync(mobileRoutes, 'utf8');
        if (res.includes(appRouteString)) {
            console.log('route string already exists');
        } else {
            res = res.replace(mobileRoutesPointer, `${appRouteString}\n  ${mobileRoutesPointer}`);
        }
        fs.writeFileSync(mobileRoutes, res, 'utf8')
    },
    async writeComponent(reducerString, prefix) {
        const providerPath = path.join(providers, `${functionName('USE', prefix)}.tsx`);
        const res = fs.existsSync(providerPath);
        if (res) {
            console.log('Skipping provider, already exists');
        } else {
            return fs.writeFileSync(providerPath, reducerString, 'utf8');
        }
    },
    async writeTypes(string) {
        const webPath = path.join(common, `swagger-definitions.ts`);
        const res = fs.existsSync(webPath);
        return fs.writeFileSync(webPath, string, 'utf8');
    },
};
