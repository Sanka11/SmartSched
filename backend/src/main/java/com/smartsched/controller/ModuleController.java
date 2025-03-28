package com.smartsched.controller;

import com.smartsched.model.Module;
import com.smartsched.model.Course;
import com.smartsched.service.ModuleService;
import com.smartsched.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "*")
public class ModuleController {

    @Autowired
    private ModuleService moduleService;

    @Autowired
    private CourseService courseService;

    // ✅ Create a module and associate it with a course
    @PostMapping("/{courseId}")
    public String createModule(@PathVariable String courseId, @RequestBody Module module) {
        Optional<Course> course = courseService.getCourseById(courseId);
        if (course.isPresent()) {
            module.setCourse(course.get());
            moduleService.saveModule(module);
            return "Module created successfully!";
        } else {
            return "Course not found!";
        }
    }

    // ✅ Get all modules
    @GetMapping
    public List<Module> getAllModules() {
        return moduleService.getAllModules();
    }

    // ✅ Get a module by ID
    @GetMapping("/{id}")
    public Optional<Module> getModuleById(@PathVariable String id) {
        return moduleService.getModuleById(id);
    }

    // ✅ Get modules by course ID
    @GetMapping("/course/{courseId}")
    public List<Module> getModulesByCourseId(@PathVariable String courseId) {
        return moduleService.getModulesByCourseId(courseId);
    }

    // ✅ Update a module
    @PutMapping("/{id}")
    public String updateModule(@PathVariable String id, @RequestBody Module moduleDetails) {
        Optional<Module> optionalModule = moduleService.getModuleById(id);
        if (optionalModule.isPresent()) {
            Module existingModule = optionalModule.get();
            existingModule.setCode(moduleDetails.getCode());
            existingModule.setModuleName(moduleDetails.getModuleName());
            existingModule.setModuleDescription(moduleDetails.getModuleDescription());
            moduleService.saveModule(existingModule);
            return "Module updated successfully!";
        } else {
            return "Module not found!";
        }
    }

    // ✅ Delete a module
    @DeleteMapping("/{id}")
    public String deleteModule(@PathVariable String id) {
        moduleService.deleteModule(id);
        return "Module deleted successfully!";
    }

    // ✅ Update a module using course ID
@PutMapping("/course/{courseId}/{moduleId}")
public String updateModuleByCourseId(
    @PathVariable String courseId,
    @PathVariable String moduleId,
    @RequestBody Module moduleDetails
) {
    Optional<Course> course = courseService.getCourseById(courseId);
    if (course.isPresent()) {
        Optional<Module> optionalModule = moduleService.getModuleById(moduleId);
        if (optionalModule.isPresent()) {
            Module existingModule = optionalModule.get();
            existingModule.setCode(moduleDetails.getCode());
            existingModule.setModuleName(moduleDetails.getModuleName());
            existingModule.setModuleDescription(moduleDetails.getModuleDescription());
            moduleService.saveModule(existingModule);
            return "Module updated successfully!";
        } else {
            return "Module not found in this course!";
        }
    } else {
        return "Course not found!";
    }
}

// ✅ Delete a module using course ID
@DeleteMapping("/course/{courseId}/{moduleId}")
public String deleteModuleByCourseId(
    @PathVariable String courseId,
    @PathVariable String moduleId
) {
    Optional<Course> course = courseService.getCourseById(courseId);
    if (course.isPresent()) {
        Optional<Module> optionalModule = moduleService.getModuleById(moduleId);
        if (optionalModule.isPresent()) {
            moduleService.deleteModule(moduleId);
            return "Module deleted successfully!";
        } else {
            return "Module not found in this course!";
        }
    } else {
        return "Course not found!";
    }
}

}