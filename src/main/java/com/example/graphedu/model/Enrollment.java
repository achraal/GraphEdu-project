package com.example.graphedu.model;

import org.springframework.data.neo4j.core.schema.RelationshipId;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;

@RelationshipProperties
@Data
@NoArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Enrollment {

    @RelationshipId
    @EqualsAndHashCode.Include
    private Long id;

    private LocalDate date;

    // Valeurs possibles : "IN_PROGRESS", "VALIDATED", "FAILED"
    private String status;

    @TargetNode
    @ToString.Exclude
    private Course course;
}
