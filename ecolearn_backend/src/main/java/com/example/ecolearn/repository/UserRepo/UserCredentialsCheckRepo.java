package com.example.ecolearn.repository.UserRepo;

import com.example.ecolearn.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserCredentialsCheckRepo extends JpaRepository<User,Long> {
    Boolean existsByEmail(String email);
}
