package com.skillsync.backend.controllers;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken.Payload;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.skillsync.backend.models.User;
import com.skillsync.backend.services.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserService userService;
    private final String googleClientId;

    public AuthController(UserService userService, @Value("${google.client.id}") String googleClientId) {
        this.userService = userService;
        this.googleClientId = googleClientId;
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth controller is working!");
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleAuth(@RequestBody Map<String, String> body) {
        System.out.println("Received request body: " + body); // Debug log

        try {
            String idToken = body.get("credential");
            if (idToken == null) {
                System.out.println("No credential provided in request"); // Debug log
                return ResponseEntity.badRequest().body("No credential provided");
            }

            System.out.println("Verifying token with client ID: " + googleClientId); // Debug log

            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            try {
                GoogleIdToken googleIdToken = verifier.verify(idToken);
                if (googleIdToken == null) {
                    System.out.println("Token verification failed - null token"); // Debug log
                    return ResponseEntity.badRequest().body("Invalid ID token");
                }

                Payload payload = googleIdToken.getPayload();
                if (payload == null) {
                    System.out.println("Token verification failed - null payload"); // Debug log
                    return ResponseEntity.badRequest().body("Invalid token payload");
                }

                String email = payload.getEmail();
                if (email == null) {
                    System.out.println("Token verification failed - null email"); // Debug log
                    return ResponseEntity.badRequest().body("Email not found in token");
                }

                String firstName = (String) payload.get("given_name");
                String lastName = (String) payload.get("family_name");

                System.out.println("Token verified successfully for email: " + email); // Debug log

                // Check if user exists
                User user = userService.findByEmail(email);
                if (user == null) {
                    System.out.println("Creating new user for email: " + email); // Debug log
                    // Create new user
                    user = new User();
                    user.setEmail(email);
                    user.setFirstName(firstName != null ? firstName : "");
                    user.setLastName(lastName != null ? lastName : "");
                    // Set a random password for Google users
                    user.setPassword(java.util.UUID.randomUUID().toString());
                    user = userService.createUser(user);
                } else {
                    System.out.println("Found existing user: " + user.getEmail()); // Debug log
                }

                // Generate JWT token
                String token = generateToken(user);

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", user);

                System.out.println("Sending successful response for user: " + user.getEmail()); // Debug log
                return ResponseEntity.ok(response);
            } catch (Exception e) {
                System.err.println("Error verifying token: " + e.getMessage()); // Debug log
                e.printStackTrace();
                return ResponseEntity.badRequest().body("Error verifying token: " + e.getMessage());
            }
        } catch (Exception e) {
            System.err.println("Error in googleAuth: " + e.getMessage()); // Debug log
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error processing request: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            String email = credentials.get("email");
            String password = credentials.get("password");

            if (email == null || password == null) {
                return ResponseEntity.badRequest().body("Email and password are required");
            }

            User user = userService.findByEmail(email);
            if (user == null || !user.getPassword().equals(password)) {
                return ResponseEntity.badRequest().body("Invalid email or password");
            }

            // Generate JWT token (you'll need to implement this)
            String token = generateToken(user);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during login: " + e.getMessage());
        }
    }

    private String generateToken(User user) {
        // TODO: Implement JWT token generation
        // For now, return a simple token
        return "dummy-token-" + user.getId();
    }
} 