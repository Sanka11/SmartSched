package com.smartsched.controller;

import com.smartsched.model.AllCourse;
import com.smartsched.service.AllCourseService;
import org.springframework.beans.factory.annotation.Autowired;
import com.smartsched.model.AllModule;
import com.smartsched.model.AllGroups;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
@RequestMapping("/api/allcourses")
public class AllCourseController {

    @Autowired
    private AllCourseService courseService;

    @GetMapping
    public List<AllCourse> getAllCourses() {
        return courseService.getAllCourses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<AllCourse> getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public AllCourse createCourse(@RequestBody AllCourse course) {
        return courseService.createCourse(course);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AllCourse> updateCourse(@PathVariable String id, @RequestBody AllCourse courseDetails) {
        try {
            AllCourse updatedCourse = courseService.updateCourse(id, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable String id) {
        try {
            boolean isDeleted = courseService.deleteCourse(id);
            if (isDeleted) {
                return ResponseEntity.ok().body("Course deleted successfully");
            }
            return ResponseEntity.badRequest().body("Failed to delete course: Course not found");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to delete course: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/modules")
    public ResponseEntity<List<AllModule>> getModules(@PathVariable String id) {
        try {
            List<AllModule> modules = courseService.getModulesByCourseId(id);
            return ResponseEntity.ok(modules);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/name/{name}/modules")
    public ResponseEntity<List<AllModule>> getModulesByCourseName(@PathVariable String name) {
        try {
            List<AllModule> modules = courseService.getModulesByCourseName(name);
            return ResponseEntity.ok(modules);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/name/{name}/groups")
    public ResponseEntity<List<AllGroups>> getGroupsByCourseName(@PathVariable String name) {
        try {
            List<AllGroups> groups = courseService.getGroupsByCourseName(name);
            return ResponseEntity.ok(groups);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}