package com.smartsched.controller;

import com.smartsched.model.Course;
import com.smartsched.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*") // Allow frontend access
public class CourseController {

    @Autowired
    private CourseService courseService;

    // Get All Courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

   // Create Course
@PostMapping
public String createCourse(@RequestBody Course course) {
    // Check if a course with the same customCourseId already exists (only for creation)
    Optional<Course> existingCourse = courseService.getCourseByCustomCourseId(course.getCustomCourseId());

    if (existingCourse.isPresent()) {
        return "Course with this Custom Course ID already exists!";
    }

    courseService.saveCourse(course);
    return "Course created successfully!";
}

    // Get Course by ID
    @GetMapping("/{id}")
    public Optional<Course> getCourseById(@PathVariable String id) {
        return courseService.getCourseById(id);
    }

    // Get Course by Custom Course ID
@GetMapping("/custom/{customCourseId}")
public Optional<Course> getCourseByCustomCourseId(@PathVariable String customCourseId) {
    return courseService.getCourseByCustomCourseId(customCourseId);
}


   // Update Course
@PutMapping("/{id}")
public Course updateCourse(@PathVariable String id, @RequestBody Course courseDetails) {
    Optional<Course> optionalCourse = courseService.getCourseById(id);
    if (optionalCourse.isPresent()) {
        Course existingCourse = optionalCourse.get();
        // Ensure you are not checking for customCourseId uniqueness here
        existingCourse.setCourseName(courseDetails.getCourseName());
        existingCourse.setCourseDuration(courseDetails.getCourseDuration());
        existingCourse.setCourseFee(courseDetails.getCourseFee());
        existingCourse.setLectures(courseDetails.getLectures());
        existingCourse.setContactMail(courseDetails.getContactMail());
        existingCourse.setDescription(courseDetails.getDescription());
        return courseService.saveCourse(existingCourse);
    } else {
        throw new RuntimeException("Course not found");
    }
}

    // Delete Course
    @DeleteMapping("/{id}")
    public String deleteCourse(@PathVariable String id) {
        courseService.deleteCourse(id);
        return "Course deleted successfully";
    }
}