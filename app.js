const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('../server/schema/schema');
const connectDB  = require('./db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();

connectDB();

app.use(cors());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Listening on 4000');
})