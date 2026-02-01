package com.example.ecolearn.repository.UserRepo;

import com.example.ecolearn.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserSignUpRepo extends JpaRepository<User,Long> {

    User findByUsername(String username);

    User findByEmail(String email);

    // Find by username or email
    @Query("SELECT u FROM User u WHERE u.username = :identifier OR u.email = :identifier")
    User findByUsernameOrEmail(@Param("identifier") String identifier);


    boolean existsByEmail(String email);

    boolean existsByUsername(String username);
}
