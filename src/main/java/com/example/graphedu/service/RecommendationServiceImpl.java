package com.example.graphedu.service;

import com.example.graphedu.dto.CourseDto;
import com.example.graphedu.dto.ShortestPathDto;
import com.example.graphedu.model.Course;
import com.example.graphedu.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final CourseRepository courseRepository;

    // Vous pouvez réutiliser votre Mapper ici
    private CourseDto mapToCourseDto(Course course) {
        return new CourseDto(course.getId(), course.getTitle(), course.getDescription(),
                course.getLevel(), course.isArchived(), null, null, List.of());
    }

    @Override
    public List<CourseDto> getCollaborativeRecommendations(Long studentId) {
        return courseRepository.recommendCoursesCollaborativeFiltering(studentId)
                .stream()
                .map(this::mapToCourseDto)
                .toList();
    }

    @Override
    public ShortestPathDto getShortestPathToCertification(Long startCourseId, Long targetCourseId) {
        List<Course> pathNodes = courseRepository.findShortestPathBetweenCourses(startCourseId, targetCourseId);

        if (pathNodes == null || pathNodes.isEmpty()) {
            throw new RuntimeException("Aucun chemin trouvé entre ces deux cours.");
        }

        List<CourseDto> pathCourses = pathNodes.stream()
                .map(this::mapToCourseDto)
                .toList();

        return new ShortestPathDto(
                startCourseId,
                targetCourseId,
                pathCourses.size(),
                pathCourses
        );
    }
}
