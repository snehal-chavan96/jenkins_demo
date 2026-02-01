package com.example.ecolearn.controller;

import com.example.ecolearn.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cloudinary")
@RequiredArgsConstructor
public class CloudinaryController {

    private final CloudinaryService cloudinaryService;

    @GetMapping("/signature")
    public ResponseEntity<?> getSignature() throws Exception {
        return ResponseEntity.ok(cloudinaryService.generateUploadSignature());
    }
}

