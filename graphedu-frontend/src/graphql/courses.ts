import { gql } from '@apollo/client';

export const GET_COURSE_CATALOG = gql`
  query GetCourseCatalog($departmentId: ID, $instructorId: ID, $level: String) {
    getCourseCatalog(departmentId: $departmentId, instructorId: $instructorId, level: $level) {
      id
      title
      description
      level
      # Les champs ci-dessous dépendent de la structure exacte de votre CourseDto
      # instructor { id name }
      # department { id name }
    }
  }
`;

export const CREATE_COURSE = gql`
  mutation CreateCourse($title: String!, $description: String!, $level: String!, $departmentId: ID!, $instructorId: ID!) {
    createCourse(title: $title, description: $description, level: $level, departmentId: $departmentId, instructorId: $instructorId) {
      id
      title
      level
    }
  }
`;

export const ADD_PREREQUISITE = gql`
  mutation AddCoursePrerequisite($courseId: ID!, $prerequisiteId: ID!) {
    addCoursePrerequisite(courseId: $courseId, prerequisiteId: $prerequisiteId) {
      id
      title
      prerequisites {
        id
        title
      }
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $title: String!, $description: String!, $level: String!) {
    updateCourse(id: $id, title: $title, description: $description, level: $level) {
      id
      title
      description
      level
    }
  }
`;

export const ARCHIVE_COURSE = gql`
  mutation ArchiveCourse($id: ID!) {
    archiveCourse(id: $id)
  }
`;