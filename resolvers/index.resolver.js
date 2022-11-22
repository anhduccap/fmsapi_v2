

module.exports = {
    Query: {
        accounts: async (parant, args, {graphRoute}) => {
            return await graphRoute.test();
        }
    }
};
