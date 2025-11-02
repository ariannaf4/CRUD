const { gql } = require('graphql-tag');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Task {
    id: ID!
    title: String!
    description: String
    dueDate: String
    completed: Boolean!
    userId: String!
    createdAt: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    # Obtener todas las tareas del usuario autenticado
    tasks: [Task!]!
    
    # Obtener información del usuario actual
    me: User
    
    # Obtener una tarea específica
    task(id: ID!): Task
  }

  type Mutation {
    # Autenticación
    login(email: String!, password: String!): AuthPayload!
    signup(username: String!, email: String!, password: String!): AuthPayload!
    
    # Gestión de tareas
    createTask(
      title: String!
      description: String
      dueDate: String
    ): Task!
    
    updateTask(
      id: ID!
      title: String
      description: String
      dueDate: String
      completed: Boolean
    ): Task!
    
    deleteTask(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;