package com.smartsched.service;


import com.smartsched.model.AllCourse;
import com.smartsched.model.AllModule;
import com.smartsched.repository.AllCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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
        return courseRepository.findById(id).map(course -> {
            course.setName(courseDetails.getName());
            course.setDescription(courseDetails.getDescription());
            course.setModules(courseDetails.getModules());
            return courseRepository.save(course);
        }).orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public void deleteCourse(String id) {
        courseRepository.deleteById(id);
    }

    // New service method to fetch modules of a course
    public List<AllModule> getModulesByCourseId(String id) {
        return courseRepository.findById(id)
                .map(AllCourse::getModules)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    // Get modules by course name
    public List<AllModule> getModulesByCourseName(String name) {
        return courseRepository.findByName(name)
                .map(AllCourse::getModules)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

}
