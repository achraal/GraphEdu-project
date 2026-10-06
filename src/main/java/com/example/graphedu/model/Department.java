package com.example.graphedu.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import lombok.Data;
import lombok.NoArgsConstructor;

@Node("Department")
@Data
@NoArgsConstructor
public class Department {
    @Id @GeneratedValue
    private Long id;
    private String name;
}
