package com.example.graphedu.service;

import com.example.graphedu.dto.ProfessorLoadDto;
import com.example.graphedu.dto.UpdateUserRequest;
import com.example.graphedu.dto.UserDto;
import com.example.graphedu.model.User;
import com.example.graphedu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.neo4j.core.Neo4jClient;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    // Le rapport retourne des valeurs agrégées (pas des nœuds) : on passe par le Neo4jClient
    private final Neo4jClient neo4jClient;

    @Override
    public List<UserDto> getAllUsersByRole(String role) {
        if (role == null) {
            return userRepository.findAll().stream().map(this::mapToDto).toList();
        }
        return userRepository.findByRole(User.Role.valueOf(role.toUpperCase()))
                .stream().map(this::mapToDto).toList();
    }

    @Override
    @Transactional
    public UserDto updateUser(UpdateUserRequest request) {
        User user = userRepository.findById(request.id())
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (request.name() != null) user.setName(request.name());
        if (request.email() != null) {
            userRepository.findByEmail(request.email())
                    .filter(other -> !other.getId().equals(user.getId()))
                    .ifPresent(other -> { throw new RuntimeException("Cet email est déjà utilisé."); });
            user.setEmail(request.email());
        }
        if (request.role() != null) user.setRole(User.Role.valueOf(request.role().toUpperCase()));

        return mapToDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("Utilisateur introuvable");
        }
        userRepository.deleteById(id);
    }

    @Override
    public List<UserDto> getStudentsByCourse(Long courseId) {
        return userRepository.findStudentsByCourseId(courseId)
                .stream().map(this::mapToDto).toList();
    }

    // Rapport : Charge horaire des professeurs (nombre de cours enseignés)
    @Override
    public List<ProfessorLoadDto> getProfessorsTeachingLoad() {
        return List.copyOf(neo4jClient.query(
                        "MATCH (i:User {role: 'INSTRUCTOR'}) " +
                        "OPTIONAL MATCH (i)-[:TEACHES]->(c:Course) " +
                        "RETURN i.name AS professorName, i.email AS professorEmail, COUNT(c) AS courseCount " +
                        "ORDER BY courseCount DESC")
                .fetchAs(ProfessorLoadDto.class)
                .mappedBy((typeSystem, record) -> new ProfessorLoadDto(
                        record.get("professorName").asString(),
                        record.get("professorEmail").asString(),
                        record.get("courseCount").asInt()))
                .all());
    }

    private UserDto mapToDto(User user) {
        return new UserDto(user.getId(), user.getEmail(), user.getName(), user.getRole().name());
    }
}
