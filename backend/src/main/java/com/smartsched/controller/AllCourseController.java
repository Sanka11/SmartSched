package com.smartsched.controller;


import com.smartsched.model.AllCourse;
import com.smartsched.service.AllCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import com.smartsched.model.AllModule;
import com.smartsched.model.AllGroups; 
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend requests
@RequestMapping("/api/allcourses")
public class AllCourseController {

    @Autowired
    private AllCourseService courseService;

    @GetMapping
    public List<AllCourse> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public Optional<AllCourse> getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id);
    }

    @PostMapping
    public AllCourse createCourse(@RequestBody AllCourse course) {
        return courseService.createCourse(course);
    }

    @PutMapping("/{id}")
    public AllCourse updateCourse(@PathVariable String id, @RequestBody AllCourse courseDetails) {
        return courseService.updateCourse(id, courseDetails);
    }

    @DeleteMapping("/{id}")
    public void deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
    }
    // New API to get modules of a specific course
    @GetMapping("/{id}/modules")
    public List<AllModule> getModules(@PathVariable String id) {
        return courseService.getModulesByCourseId(id);
    }

    // Get modules by course name
    @GetMapping("/name/{name}/modules")
    public List<AllModule> getModulesByCourseName(@PathVariable String name) {
        return courseService.getModulesByCourseName(name);
    }

    // Get class by course name
    @GetMapping("/name/{name}/groups")
    public List<AllGroups> getGroupsByCourseName(@PathVariable String name) {
        return courseService.getGroupsByCourseName(name);
    }

}

