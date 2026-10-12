import { gql } from '@apollo/client';

export const GET_USERS_BY_ROLE = gql`
  query GetUsersByRole($role: String!) {
    getUsersByRole(role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const UPDATE_USER_PROFILE = gql`
  mutation UpdateUserProfile($id: ID!, $name: String!, $email: String!, $role: String!) {
    updateUserProfile(id: $id, name: $name, email: $email, role: $role) {
      id
      name
      email
      role
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export const GET_STUDENTS_IN_COURSE = gql`
  query GetStudentsInCourse($courseId: ID!) {
    getStudentsInCourse(courseId: $courseId) {
      id
      name
      email
    }
  }
`;

export const GET_TEACHING_LOAD_REPORT = gql`
  query GetTeachingLoadReport {
    getTeachingLoadReport {
      professorId
      professorName
      courseCount
      # Ajoutez ici d'autres champs de ProfessorLoadDto si nécessaire (ex: totalHours)
    }
  }
`;