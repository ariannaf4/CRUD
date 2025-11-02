import { gql } from '@apollo/client';

// Mutation para crear tarea
export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($title: String!, $description: String, $dueDate: String, $dbType: String!) {
    createTask(title: $title, description: $description, dueDate: $dueDate, dbType: $dbType) {
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

// Mutation para actualizar tarea
export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($id: ID!, $dbType: String!, $title: String, $description: String, $dueDate: String, $completed: Boolean) {
    updateTask(id: $id, dbType: $dbType, title: $title, description: $description, dueDate: $dueDate, completed: $completed) {
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

// Mutation para eliminar tarea
export const DELETE_TASK_MUTATION = gql`
  mutation DeleteTask($id: ID!, $dbType: String!) {
    deleteTask(id: $id, dbType: $dbType)
  }
`;