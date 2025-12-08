package com.example.user.util;

import com.example.user.dto.UserDTO;
import com.example.user.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    
    /**
     * Convert User entity to UserDTO
     */
    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }
        
        return new UserDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail()
        );
    }
    
    /**
     * Convert UserDTO to User entity (without password)
     * Note: This is mainly for updates where password is not included
     */
    public User toEntity(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }
        
        User user = new User();
        user.setId(userDTO.getId());
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        
        return user;
    }
    
    /**
     * Update existing User entity with UserDTO data
     */
    public void updateEntityFromDTO(User user, UserDTO userDTO) {
        if (user == null || userDTO == null) {
            return;
        }
        
        if (userDTO.getUsername() != null) {
            user.setUsername(userDTO.getUsername());
        }
        if (userDTO.getEmail() != null) {
            user.setEmail(userDTO.getEmail());
        }
    }
}
