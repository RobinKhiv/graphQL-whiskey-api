'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const graphqlHTTP = require('express-graphql');
// const { buildSchema } = require('graphql');

const app = express();

// const schema = buildSchema(`type Query {
//   user(query: String): [User!]!
//   user_list: WhiskeyList!
//   whiskey: Whiskey!
//   comment: [Comment!]
// }
// type User {
//   id: ID!
//   user_name: String!
//   full_name: String!
//   nickname: String
//   password: String!
// }
// type Whiskey {
//   id: ID!
//   whiskey_name: String!
//   image: String!
//   origin: String
//   abv: Int 
//   price: Float
//   content: String
//   nose: String
//   palate: String
//   finish: String
//   user: User!
//   comment: [Comment!]!
// }
// type Comment {
//   id: ID!
//   rating: Int!
//   tasting: String!
//   whiskey: Whiskey!
// }
// type WhiskeyList {
//   favorite: [Whiskey!]!
//   wish: [Whiskey!]!
//   tried: [Whiskey!]!
// }`);

const root = {
  hello: () => {
    return 'Hello world!';
  },
};

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
app.use('/graphql', graphqlHTTP({
  schema: './schema.graphql',
  rootValue: root,
  graphiql: true,
}));

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;