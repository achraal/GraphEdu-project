import { gql } from '@apollo/client';

export const ENROLL_STUDENT = gql`
  mutation EnrollStudentInCourse($studentId: ID!, $courseId: ID!) {
    enrollStudentInCourse(studentId: $studentId, courseId: $courseId)
  }
`;

export const GET_STUDENT_PATHWAY = gql`
  query GetStudentPathway($studentId: ID!, $departmentId: ID!) {
    getStudentPathway(studentId: $studentId, departmentId: $departmentId) {
      completedCourses {
        id
        title
        level
      }
      remainingCourses {
        id
        title
        level
      }
      # Adaptez ces champs selon la structure exacte de votre PathwayDto
    }
  }
`;

// Utilise la requête "me" pour récupérer l'utilisateur courant et ses inscriptions (SchemaMapping)
export const GET_MY_ENROLLMENTS = gql`
  query GetMyEnrollments {
    me {
      id
      name
      enrollments {
        id
        status
        date
        course {
          id
          title
          level
        }
      }
    }
  }
`;