package com.smartsched.service;

import com.smartsched.model.Course;
import com.smartsched.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {
    @Autowired
    private CourseRepository courseRepository;

    // Create or Update Course
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    // Get All Courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get Course by ID
    public Optional<Course> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    // Delete Course by ID
    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }
}
