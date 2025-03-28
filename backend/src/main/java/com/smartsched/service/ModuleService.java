package com.smartsched.service;

import com.smartsched.model.Module;
import com.smartsched.repository.ModuleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ModuleService {

    @Autowired
    private ModuleRepository moduleRepository;

    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public Optional<Module> getModuleById(String id) {
        return moduleRepository.findById(id);
    }

    public List<Module> getModulesByCourseId(String courseId) {
        return moduleRepository.findByCourse_CourseId(courseId);
    }

    public Module saveModule(Module module) {
        return moduleRepository.save(module);
    }

    public void deleteModule(String id) {
        moduleRepository.deleteById(id);
    }
}