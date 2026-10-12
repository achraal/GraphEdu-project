package com.example.graphedu.controller;

import com.example.graphedu.dto.CourseDto;
import com.example.graphedu.dto.ShortestPathDto;
import com.example.graphedu.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @QueryMapping
    @PreAuthorize("hasRole('STUDENT')")
    public List<CourseDto> getCourseRecommendations(@Argument Long studentId) {
        return recommendationService.getCollaborativeRecommendations(studentId);
    }

    @QueryMapping
    @PreAuthorize("isAuthenticated()")
    public ShortestPathDto getShortestCertificationPath(@Argument Long startCourseId, @Argument Long targetCourseId) {
        return recommendationService.getShortestPathToCertification(startCourseId, targetCourseId);
    }
}