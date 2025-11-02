const { mergeResolvers } = require('@graphql-tools/merge');
const authResolvers = require('./authResolvers');
const taskResolvers = require('./taskResolvers');

const resolvers = mergeResolvers([authResolvers, taskResolvers]);

module.exports = resolvers;