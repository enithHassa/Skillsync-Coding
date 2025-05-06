package com.skillsync.backend.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String displayName;
    private String profileImage;
    private int age;
    private String address;
    private String phoneNumber;
    private String email;
    private String password;

    public String getDisplayName() {
        if (displayName != null && !displayName.isEmpty()) {
            return displayName;
        }
        return firstName + " " + lastName;
    }

    public String getProfileImage() {
        return profileImage != null ? profileImage : "";
    }
}

