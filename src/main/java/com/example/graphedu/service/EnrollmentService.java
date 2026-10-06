package com.example.graphedu.service;

import com.example.graphedu.dto.EnrollmentDto;
import com.example.graphedu.dto.PathwayDto;

import java.util.List;

public interface EnrollmentService {
    boolean enrollStudent(Long studentId, Long courseId);
    PathwayDto getStudentPathway(Long studentId, Long departmentId);
    List<EnrollmentDto> getStudentEnrollments(Long studentId);
}