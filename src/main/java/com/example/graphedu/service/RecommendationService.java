package com.example.graphedu.service;

import com.example.graphedu.dto.CourseDto;
import com.example.graphedu.dto.ShortestPathDto;

import java.util.List;

public interface RecommendationService {
    List<CourseDto> getCollaborativeRecommendations(Long studentId);
    ShortestPathDto getShortestPathToCertification(Long startCourseId, Long targetCourseId);
}
