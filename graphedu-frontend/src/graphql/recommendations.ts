import { gql } from '@apollo/client';

export const GET_COURSE_RECOMMENDATIONS = gql`
  query GetCourseRecommendations($studentId: ID!) {
    getCourseRecommendations(studentId: $studentId) {
      id
      title
      description
      level
    }
  }
`;

export const GET_SHORTEST_PATH = gql`
  query GetShortestCertificationPath($startCourseId: ID!, $targetCourseId: ID!) {
    getShortestCertificationPath(startCourseId: $startCourseId, targetCourseId: $targetCourseId) {
      totalCourses
      path {
        id
        title
        level
      }
    }
  }
`;