package com.example.user.service;

import com.example.user.dto.UserDTO;
import com.example.user.dto.UserCreateRequest;
import com.example.user.dto.UserUpdateRequest;
import com.example.user.entity.User;

import java.util.List;
import java.util.Optional;

public interface UserService {
    
    // Create a new user
    UserDTO createUser(UserCreateRequest request);
    
    // Get all users
    List<UserDTO> getAllUsers();
    
    // Get user by ID
    UserDTO getUserById(Long id);
    
    // Get user by username
    UserDTO getUserByUsername(String username);
    
    // Get user by email
    UserDTO getUserByEmail(String email);
    
    // Update user
    UserDTO updateUser(Long id, UserUpdateRequest request);
    
    // Delete user by ID
    void deleteUser(Long id);
    
    // Check if user exists by ID
    boolean existsById(Long id);
    
    // Check if username exists
    boolean existsByUsername(String username);
    
    // Check if email exists
    boolean existsByEmail(String email);
    
    // Search users by username containing
    List<UserDTO> searchUsersByUsername(String username);
    
    // Search users by email containing
    List<UserDTO> searchUsersByEmail(String email);
    
    // Get all users ordered by username
    List<UserDTO> getAllUsersOrderedByUsername();
}
