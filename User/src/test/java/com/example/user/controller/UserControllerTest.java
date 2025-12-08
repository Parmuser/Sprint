package com.example.user.controller;

import com.example.user.dto.UserCreateRequest;
import com.example.user.dto.UserDTO;
import com.example.user.dto.UserUpdateRequest;
import com.example.user.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    private UserDTO testUserDTO;
    private UserCreateRequest createRequest;
    private UserUpdateRequest updateRequest;

    @BeforeEach
    void setUp() {
        testUserDTO = new UserDTO(1L, "testuser", "test@example.com");
        createRequest = new UserCreateRequest("testuser", "test@example.com", "password123");
        updateRequest = new UserUpdateRequest("updateduser", "updated@example.com", "newpassword");
    }

    @Test
    void createUser_Success() throws Exception {
        // Given
        when(userService.createUser(any(UserCreateRequest.class))).thenReturn(testUserDTO);

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void getAllUsers_Success() throws Exception {
        // Given
        List<UserDTO> users = Arrays.asList(testUserDTO);
        when(userService.getAllUsers()).thenReturn(users);

        // When & Then
        mockMvc.perform(get("/api/users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].username").value("testuser"));
    }

    @Test
    void getUserById_Success() throws Exception {
        // Given
        when(userService.getUserById(1L)).thenReturn(testUserDTO);

        // When & Then
        mockMvc.perform(get("/api/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("testuser"))
                .andExpect(jsonPath("$.email").value("test@example.com"));
    }

    @Test
    void updateUser_Success() throws Exception {
        // Given
        UserDTO updatedUserDTO = new UserDTO(1L, "updateduser", "updated@example.com");
        when(userService.updateUser(eq(1L), any(UserUpdateRequest.class))).thenReturn(updatedUserDTO);

        // When & Then
        mockMvc.perform(put("/api/users/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("updateduser"))
                .andExpect(jsonPath("$.email").value("updated@example.com"));
    }

    @Test
    void deleteUser_Success() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/users/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void searchUsersByUsername_Success() throws Exception {
        // Given
        List<UserDTO> users = Arrays.asList(testUserDTO);
        when(userService.searchUsersByUsername("test")).thenReturn(users);

        // When & Then
        mockMvc.perform(get("/api/users/search/username?q=test"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].username").value("testuser"));
    }

    @Test
    void createUser_InvalidInput_BadRequest() throws Exception {
        // Given - invalid create request (missing required fields)
        UserCreateRequest invalidRequest = new UserCreateRequest("", "", "");

        // When & Then
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }
}
