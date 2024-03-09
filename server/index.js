const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const mongoose = require('mongoose');

// Connect to MongoDB

console.log("Connecting to database...");
mongoose.connect('mongodb+srv://newuser:newuser@project.9udyghq.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;


db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define User Model
const User = mongoose.model('User', {
    name: String,
    age: Number,
    email: { type: String, unique: true }
});

// GraphQL Schema
const typeDefs = gql`
type User {
    id: ID!
    name: String!
    age: Int!
    email: String!
}

type Query {
    users: [User]!
}

type Mutation {
    createUser(name: String!, age: Int!, email: String!): User
    deleteUser(id: ID!): User
}
`;

const resolvers = {
    Query: {
        users: async () => await User.find()
    },
    Mutation: {
        createUser: async (_, args) => {
            console.log("work!");
            const user = new User(args);
            return await user.save();
        },
        deleteUser: async (_, args) => {
            console.log(args.id);
            await User.findOneAndDelete(args.id)}
        }
    };
    
const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
// Asynchronously start Apollo Server
async function startApolloServer() {
    await server.start();
    server.applyMiddleware({ app });
  }
  
  startApolloServer().then(() => {
    // Start Express server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}/graphql`);
    });
  });