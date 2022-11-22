const express = require('express');
const logger = require('morgan');
const dotenv = require('dotenv').config();
const { I18n } = require('i18n');
const path = require('path');
const { gql, ApolloServer } = require('apollo-server-express');

const db = require('./config/db_config');
const indexRouter = require('./routes/index');
const middleware = require('./middlewares/index');
const updateStat = require('./helpers/updateStat');
// const typeDefs = require('./schemas/index.schema');
// const resolvers = require('./resolvers/index.resolver');
// const graphRoute = require('./routes/graphql.router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const i18n = new I18n({
    locales: ['vi','en'],
    directory: path.join(__dirname, 'locales')
});

app.use(i18n.init);
app.set('trust proxy', true)

//connect DB
db();

// Cron job
updateStat();

// Setup GraphQL
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello world!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app });

// Set index router
app.use('/', middleware.checkIP, indexRouter);

module.exports = app;
