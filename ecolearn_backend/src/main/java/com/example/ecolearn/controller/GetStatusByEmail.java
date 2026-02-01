package com.example.ecolearn.controller;

import com.example.ecolearn.entity.User;
import com.example.ecolearn.repository.UserRepo.UserSignUpRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class GetStatusByEmail {

    @Autowired
    private UserSignUpRepo userSignUpRepo;

    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email){

        User user = userSignUpRepo.findByEmail(email);

        if(user==null){
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(user);
    }

}
