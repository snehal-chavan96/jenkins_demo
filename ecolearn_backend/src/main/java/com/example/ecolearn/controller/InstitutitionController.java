package com.example.ecolearn.controller;

import com.example.ecolearn.entity.Institution;
import com.example.ecolearn.service.InstitutionService.InstitutionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/institution")
public class InstitutitionController {
    private final InstitutionService service;

    public InstitutitionController(InstitutionService service){
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Institution> createInstitution(@RequestBody Institution institution){
        return ResponseEntity.ok(service.createInstitution((institution)));
    }

    @GetMapping
    public ResponseEntity<List<Institution>> getAllInstitution(){
        return ResponseEntity.ok(service.getAllInstitution());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Institution> getInstitution(@PathVariable Long id){
        return ResponseEntity.ok(service.getInstitutionById(id));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Institution> updateInstitution(@PathVariable Long id,@RequestBody Institution institution){
        return ResponseEntity.ok(service.updateInstitution(id,institution));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstitution(@PathVariable Long id){
        service.deleteInstitution(id);
        return ResponseEntity.noContent().build();
    }
}
