const templates = require('./templates');
const writer = require('./helpers/writer');

module.exports = {
    async writeCollection(action, prefix, api, createProvider, type='any') {
        const actionStrings = templates.action(action, prefix);
        const appAction = templates.getCollection(action, prefix);
        const yieldString = templates.yieldCollection(action, prefix, api);
        const stateTypes = templates.stateTypes(action, prefix, type);
        const requestStateTypes = templates.collectionRequestStateTypes(action, prefix, type);
        const takeLatest = templates.takeLatest(action, prefix, api);
        const reducer = templates.reducerCollection(action, prefix, api);
        console.log('Writing collection', action, prefix, api);
        const provider = templates.providerCollection(action, prefix, api);
        // const reactNativeExample = templates.reactNativeCollection(action, prefix, api)
        await writer.writeActions(actionStrings, appAction);
        console.log('Wrote actions');
        await writer.writeSaga(yieldString, takeLatest);
        console.log('Wrote saga');
        await writer.writeReducer(reducer, stateTypes, requestStateTypes);
        console.log('Wrote reducer');
        if (createProvider) {
            await writer.writeProvider(provider, prefix);
        }
    },
    async writeAction(action,prefix) {
        const actionStrings = templates.singleAction(action, prefix);
        const appAction = templates.getCollection(action, prefix);
        const stateTypes = templates.stateTypesSingle(action, prefix);
        const requestStateTypes = templates.singleRequestTypes(action, prefix, null);
        const reducer = templates.reducerSingle(action, prefix);
        const provider = templates.providerSingle(action, prefix);

        await writer.writeActions(actionStrings, appAction);
        await writer.writeReducer(reducer, stateTypes, requestStateTypes);
        await writer.writeProvider(provider, prefix);
        // console.log(actionStrings)
        // console.log(appAction)
        // console.log(requestStateTypes)
        // console.log(reducer)
        // console.log(stateTypes)

    },
    async writeComponent(name) {
        const componentString = templates.component(name);
        await writer.writeComponent(componentString, name);
    },
    async writePost(action, prefix, api, createProvider, type='any', crud) {
        const actionStrings = templates.action(action, prefix);
        const appAction = templates.post(action, prefix);
        const yieldString = templates.yieldPost(action, prefix, api);
        const takeLatest = templates.takeEvery(action, prefix, api);
        const reducer = templates.reducerPost(action, prefix, api);
        const stateTypes = templates.stateTypes(action, prefix, type);
        const requestStateTypes = templates.requestStateTypesPost(action, prefix, type);
        const provider = crud ? templates.providerItem(action, prefix, api) : templates.providerPost(action, prefix, api);
        // const reactNativeExample = templates.reactNativeGPost(action, prefix, api)
        await writer.writeActions(actionStrings, appAction);
        await writer.writeSaga(yieldString, takeLatest);
        await writer.writeReducer(reducer, stateTypes, requestStateTypes);
        if (createProvider) {
            await writer.writeProvider(provider, prefix);
        }
    },
    async writeGet(action, prefix, api, createProvider, type='any') {
        const actionStrings = templates.action(action, prefix);
        const appAction = templates.get(action, prefix);
        const yieldString = templates.yieldGet(action, prefix, api);
        const takeLatest = templates.takeEvery(action, prefix, api);
        const reducer = templates.reducerGet(action, prefix, api);
        const stateTypes = templates.stateTypes(action, prefix, type);
        const requestStateTypes = templates.requestStateTypes(action, prefix, type);
        const provider = templates.providerItem(action, prefix, api);
        await writer.writeActions(actionStrings, appAction);
        await writer.writeSaga(yieldString, takeLatest);
        await writer.writeReducer(reducer, stateTypes, requestStateTypes);
        if (createProvider) {
            await writer.writeProvider(provider, prefix);
        }
    },
    async writeDelete(action, prefix, api, createProvider, type='any') {
        const actionStrings = templates.action(action, prefix);
        const appAction = templates.delete(action, prefix);
        const yieldString = templates.yieldDelete(action, prefix, api);
        const takeLatest = templates.takeEvery(action, prefix, api);
        const reducer = templates.reducerUpdate(action, prefix, api);
        const stateTypes = templates.stateTypes(action, prefix, type);
        const requestStateTypes = templates.requestStateTypes(action, prefix, type);
        const provider = templates.providerItem(action, prefix, api);
        console.log('Writing delete', action, prefix, api);
        await writer.writeActions(actionStrings, appAction);
        await writer.writeSaga(yieldString, takeLatest);
        await writer.writeReducer(reducer, stateTypes, requestStateTypes);
        if (createProvider) {
            await writer.writeProvider(provider, prefix);
        }
    },
    async writeUpdate(action, prefix, api, createProvider, type='any') {
        console.log("Update", type)
        const actionStrings = templates.action(action, prefix);
        const appAction = templates.update(action, prefix);
        const yieldString = templates.yieldUpdate(action, prefix, api);
        const takeLatest = templates.takeEvery(action, prefix, api);
        const reducer = templates.reducerUpdate(action, prefix, api);
        const stateTypes = templates.stateTypes(action, prefix, type);
        const requestStateTypes = templates.requestStateTypes(action, prefix, type);
        const provider = templates.providerItem(action, prefix, api);
        console.log('Writing update', action, prefix, api);
        await writer.writeActions(actionStrings, appAction);
        await writer.writeSaga(yieldString, takeLatest);
        await writer.writeReducer(reducer, stateTypes, requestStateTypes);
        if (createProvider) {
            await writer.writeProvider(provider, prefix);
        }
    },
    async writeScreen(name, path,key) {
        const routeUrl = templates.screenRouteUrl(key,path);
        const route = templates.screenRoute(name,key);
        const routeImport = templates.screenRouteImport(name);
        const component = templates.screenComponent(name);
        const routeComponent = templates.routeComponent(name);

        await writer.writeRouteUrl(routeUrl);
        await writer.writeRoute(routeImport, route);
        await writer.writeScreenComponent(name,component);
        await writer.writeAppRouteComponent(routeComponent);

    },
};
