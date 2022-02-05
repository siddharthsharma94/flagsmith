module.exports = {
    E2E: process.env.E2E,
    'projectOverrides': JSON.stringify({
        ga: process.env.GA,
        api: process.env.API_URL,
    }),
};
