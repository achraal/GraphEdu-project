package com.example.graphedu.controller;

import com.example.graphedu.dto.ProfessorLoadDto;
import com.example.graphedu.dto.UpdateUserRequest;
import com.example.graphedu.dto.UserDto;
import com.example.graphedu.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;

import java.util.List;

@Controller
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // --- GESTION DES PROFILS ---

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<UserDto> getUsersByRole(@Argument String role) {
        return userService.getAllUsersByRole(role);
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public UserDto updateUserProfile(
            @Argument Long id, @Argument String name,
            @Argument String email, @Argument String role) {
        return userService.updateUser(new UpdateUserRequest(id, name, email, role));
    }

    @MutationMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Boolean deleteUser(@Argument Long id) {
        userService.deleteUser(id);
        return true;
    }

    // --- RAPPORTS ET TABLEAUX DE BORD ---

    @QueryMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public List<UserDto> getStudentsInCourse(@Argument Long courseId) {
        return userService.getStudentsByCourse(courseId);
    }

    @QueryMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ProfessorLoadDto> getTeachingLoadReport() {
        return userService.getProfessorsTeachingLoad();
    }
}
