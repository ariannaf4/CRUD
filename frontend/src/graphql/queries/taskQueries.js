import { gql } from '@apollo/client';

// Query para obtener todas las tareas del usuario
export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      title
      description
      dueDate
      completed
      dbType
      userId
      createdAt
    }
  }
`;

// Query para obtener una tarea específica
export const GET_TASK = gql`
  query GetTask($id: ID!, $dbType: String!) {
    task(id: $id, dbType: $dbType) {
      id
      title
      description
      dueDate
      completed
      dbType
      userId
      createdAt
    }
  }
`;

// Query para obtener información del usuario actual
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
      email
    }
  }
`;