package com.example.graphedu.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
import java.util.Set;

@Node("Course")
@Data
@NoArgsConstructor
// Égalité basée sur l'id uniquement : évite les boucles infinies hashCode/toString à travers le graphe
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Course {
    @Id @GeneratedValue
    @EqualsAndHashCode.Include
    private Long id;

    private String title;
    private String description;
    private String level; // ex: BEGINNER, INTERMEDIATE, ADVANCED
    private boolean archived = false; // Pour l'archivage logique

    // (Course)-[:BELONGS_TO]->(Department)
    @Relationship(type = "BELONGS_TO", direction = Relationship.Direction.OUTGOING)
    @ToString.Exclude
    private Department department;

    // (Instructor)-[:TEACHES]->(Course)
    @Relationship(type = "TEACHES", direction = Relationship.Direction.INCOMING)
    @ToString.Exclude
    private User instructor;

    // (Course)-[:REQUIRES]->(Course)
    @Relationship(type = "REQUIRES", direction = Relationship.Direction.OUTGOING)
    @ToString.Exclude
    private Set<Course> prerequisites = new HashSet<>();
}
