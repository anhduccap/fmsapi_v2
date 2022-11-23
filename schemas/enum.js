const {GraphQLEnumType} = require('graphql');

exports.accountStatus = new GraphQLEnumType({
    name: 'AccountStatus',
    values: {
        ACTIVE: {value: 'ACTIVE'},
        DEACTIVE: {value: 'DEACTIVE'},
        BANNED: {value: 'BANNED'},
    }
});

exports.accountType = new GraphQLEnumType({
    name: 'AccountType',
    values: {
        PLAYER: {value: 'PLAYER'},
        COACH: {value: 'COACH'},
        ADMIN: {value: 'ADMIN'},
    }
});
