package com.example.graphedu.repository;

import com.example.graphedu.model.User;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends Neo4jRepository<User, Long> {
    Optional<User> findByEmail(String email);

    List<User> findByRole(User.Role role);

    // Rapport : Liste des étudiants inscrits à un cours spécifique
    @Query("MATCH (u:User {role: 'STUDENT'})-[:ENROLLED_IN]->(c:Course) " +
            "WHERE id(c) = $courseId " +
            "RETURN u")
    List<User> findStudentsByCourseId(@Param("courseId") Long courseId);
}
