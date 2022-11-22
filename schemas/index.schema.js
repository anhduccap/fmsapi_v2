const { gql } = require('apollo-server-express');

module.exports = gql`
    type Account {
        id: ID
        name: String
        genre: String
    }

    type Query {
        accounts: String
    }
`;
