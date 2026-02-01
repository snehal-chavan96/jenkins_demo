package com.example.ecolearn.service.InstitutionService;

import com.example.ecolearn.entity.Institution;
import com.example.ecolearn.repository.InstitutionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InstitutionService {
    private final InstitutionRepository repository;

    public InstitutionService(InstitutionRepository repository){
        this.repository = repository;
    }
    public Institution createInstitution(Institution institution){
        return repository.save(institution);
    }
    public List<Institution> getAllInstitution(){
        return repository.findAll();
    }
    public Institution getInstitutionById(Long id){
        return repository.findById(id).orElseThrow(()-> new RuntimeException("Institute not found"));
    }

    public Institution updateInstitution(Long id, Institution updated){
        Institution institution = getInstitutionById(id);
        institution.setName(updated.getName());
        institution.setType(updated.getType());
        institution.setAddress(updated.getAddress());
        institution.setCity(updated.getCity());
        institution.setState(updated.getState());
        institution.setCountry(updated.getCountry());
        return repository.save(institution);
    }

    public void deleteInstitution(Long id){
        repository.deleteById(id);
    }
}
