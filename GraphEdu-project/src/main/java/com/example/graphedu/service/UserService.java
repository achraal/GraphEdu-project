package com.example.graphedu.service;

import com.example.graphedu.dto.ProfessorLoadDto;
import com.example.graphedu.dto.UpdateUserRequest;
import com.example.graphedu.dto.UserDto;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsersByRole(String role);
    UserDto updateUser(UpdateUserRequest request);
    void deleteUser(Long id);

    // Rapports pour les tableaux de bord
    List<UserDto> getStudentsByCourse(Long courseId);
    List<ProfessorLoadDto> getProfessorsTeachingLoad();
}
