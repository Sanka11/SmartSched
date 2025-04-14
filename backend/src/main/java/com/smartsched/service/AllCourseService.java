package com.smartsched.service;

import com.smartsched.model.AllCourse;
import com.smartsched.repository.AllCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.smartsched.model.AllModule;
import com.smartsched.model.AllGroups;

import java.util.List;
import java.util.Optional;

@Service
public class AllCourseService {

    @Autowired
    private AllCourseRepository courseRepository;

    public List<AllCourse> getAllCourses() {
        return courseRepository.findAll();
    }

    public Optional<AllCourse> getCourseById(String id) {
        return courseRepository.findById(id);
    }

    public AllCourse createCourse(AllCourse course) {
        return courseRepository.save(course);
    }

    public AllCourse updateCourse(String id, AllCourse courseDetails) {
        AllCourse course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        course.setName(courseDetails.getName());
        course.setDescription(courseDetails.getDescription());
        course.setCourseFee(courseDetails.getCourseFee());
        course.setCourseDuration(courseDetails.getCourseDuration());
        course.setContactEmail(courseDetails.getContactEmail());
        course.setModules(courseDetails.getModules());
        course.setGroups(courseDetails.getGroups());
        
        return courseRepository.save(course);
    }

    public boolean deleteCourse(String id) {
        if (courseRepository.existsById(id)) {
            courseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public List<AllModule> getModulesByCourseId(String id) {
        AllCourse course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        return course.getModules();
    }

    public List<AllModule> getModulesByCourseName(String name) {
        AllCourse course = courseRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Course not found with name: " + name));
        return course.getModules();
    }

    public List<AllGroups> getGroupsByCourseName(String name) {
        AllCourse course = courseRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Course not found with name: " + name));
        return course.getGroups();
    }
}