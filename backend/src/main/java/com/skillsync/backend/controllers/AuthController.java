package com.skillsync.backend.controllers;

import com.skillsync.backend.models.User;
import com.skillsync.backend.repositories.UserRepository;
import com.skillsync.backend.services.UserService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
public class AuthController {
    private final UserRepository userRepository;
    private final UserService userService;

    public AuthController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @GetMapping("/user/me")
    public User user(@AuthenticationPrincipal OAuth2User principal) {
        if (principal == null) return null;
        String email = principal.getAttribute("email");
        if (email == null) return null;
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return userOpt.get();
        } else {
            // Create a new user from OAuth2 info
            String name = principal.getAttribute("name");
            String firstName = principal.getAttribute("given_name");
            String lastName = principal.getAttribute("family_name");
            if (firstName == null && name != null) {
                String[] parts = name.split(" ", 2);
                firstName = parts[0];
                lastName = parts.length > 1 ? parts[1] : "";
            }
            String profileImage = principal.getAttribute("picture");
            User newUser = new User();
            newUser.setFirstName(firstName != null ? firstName : "");
            newUser.setLastName(lastName != null ? lastName : "");
            newUser.setDisplayName(name != null ? name : firstName + " " + lastName);
            newUser.setProfileImage(profileImage);
            newUser.setAge(0);
            newUser.setAddress("");
            newUser.setPhoneNumber("");
            newUser.setEmail(email);
            newUser.setPassword("");
            userService.createUser(newUser);
            return newUser;
        }
    }

    @GetMapping("/oauth2/success")
    public String oauth2Success() {
        // This endpoint is just a placeholder for the defaultSuccessUrl
        return "OAuth2 login successful. You can close this window and return to the app.";
    }
} 