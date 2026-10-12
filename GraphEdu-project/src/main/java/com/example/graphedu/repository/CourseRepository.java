package com.example.graphedu.repository;

import com.example.graphedu.model.Course;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends Neo4jRepository<Course, Long> {

    // Filtre dynamique : si le paramètre est null, il est ignoré. On exclut les cours archivés.
    // Remarque : un WHERE placé après un OPTIONAL MATCH ne filtre que ce OPTIONAL MATCH,
    // d'où le WITH ... WHERE pour filtrer réellement les cours.
    @Query("MATCH (c:Course) " +
            "WHERE c.archived = false " +
            "AND ($level IS NULL OR c.level = $level) " +
            "OPTIONAL MATCH (c)-[b:BELONGS_TO]->(d:Department) " +
            "OPTIONAL MATCH (i:User)-[t:TEACHES]->(c) " +
            "WITH c, b, d, t, i " +
            "WHERE ($departmentId IS NULL OR id(d) = $departmentId) " +
            "AND ($instructorId IS NULL OR id(i) = $instructorId) " +
            "OPTIONAL MATCH (c)-[r:REQUIRES]->(p:Course) " +
            "RETURN c, collect(b), collect(d), collect(t), collect(i), collect(r), collect(p)")
    List<Course> findFilteredCourses(@Param("departmentId") Long departmentId,
                                     @Param("instructorId") Long instructorId,
                                     @Param("level") String level);

    @Query("MATCH (target:Course)-[:REQUIRES]->(prereq:Course) " +
            "WHERE id(target) = $courseId " +
            "AND NOT EXISTS { " +
            "  MATCH (s:User)-[e:ENROLLED_IN]->(prereq) " +
            "  WHERE id(s) = $studentId AND e.status = 'VALIDATED' " +
            "} " +
            "RETURN prereq")
    List<Course> findMissingPrerequisites(@Param("studentId") Long studentId, @Param("courseId") Long courseId);

    @Query("MATCH (c:Course)-[:BELONGS_TO]->(d:Department) WHERE id(d) = $departmentId RETURN c")
    List<Course> findByDepartmentId(@Param("departmentId") Long departmentId);

    @Query("MATCH (u:User)-[:ENROLLED_IN]->(c:Course)<-[:ENROLLED_IN]-(peer:User)-[:ENROLLED_IN]->(reco:Course) " +
            "WHERE id(u) = $studentId " +
            "AND NOT (u)-[:ENROLLED_IN]->(reco) " +
            "AND reco.archived = false " +
            "WITH reco, COUNT(peer) AS score " +
            "ORDER BY score DESC LIMIT 5 " +
            "RETURN reco")
    List<Course> recommendCoursesCollaborativeFiltering(@Param("studentId") Long studentId);

    // Proposer le chemin le plus court (Shortest Path)
    // La fonction nodes(p) retourne la liste ordonnée des nœuds sur le chemin ;
    // UNWIND renvoie un nœud par ligne (dans l'ordre) pour que SDN puisse mapper une List<Course>.
    @Query("MATCH (start:Course), (target:Course) " +
            "WHERE id(start) = $startCourseId AND id(target) = $targetCourseId " +
            "MATCH p = shortestPath((start)-[:REQUIRES*]->(target)) " +
            "UNWIND nodes(p) AS c " +
            "RETURN c")
    List<Course> findShortestPathBetweenCourses(@Param("startCourseId") Long startCourseId, @Param("targetCourseId") Long targetCourseId);
}