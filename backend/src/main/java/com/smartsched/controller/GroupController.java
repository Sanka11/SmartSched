package com.smartsched.controller;

import com.smartsched.model.Group;
import com.smartsched.repository.AllClassAssignmentRepository;
import com.smartsched.model.Course;
import com.smartsched.service.GroupService;
import com.smartsched.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/groups")
@CrossOrigin(origins = "*")
public class GroupController {

    @Autowired
    private GroupService groupService;

    @Autowired
    private CourseService courseService;

    @Autowired
private AllClassAssignmentRepository allClassAssignmentRepository;


    // ✅ Create a group and associate it with a course
    @PostMapping("/{courseId}")
    public String createGroup(@PathVariable String courseId, @RequestBody Group group) {
        Optional<Course> course = courseService.getCourseById(courseId);
        if (course.isPresent()) {
            group.setCourse(course.get());
            groupService.saveGroup(group);
            return "Group created successfully!";
        } else {
            return "Course not found!";
        }
    }

    // ✅ Get all groups
    @GetMapping
    public List<Group> getAllGroups() {
        return groupService.getAllGroups();
    }

    // ✅ Get a group by ID
    @GetMapping("/{id}")
    public Optional<Group> getGroupById(@PathVariable String id) {
        return groupService.getGroupById(id);
    }

    // ✅ Get groups by course ID
    @GetMapping("/course/{courseId}")
    public List<Group> getGroupsByCourseId(@PathVariable String courseId) {
        return groupService.getGroupsByCourseId(courseId);
    }

    // ✅ Update a group
    @PutMapping("/{id}")
    public String updateGroup(@PathVariable String id, @RequestBody Group groupDetails) {
        Optional<Group> optionalGroup = groupService.getGroupById(id);
        if (optionalGroup.isPresent()) {
            Group existingGroup = optionalGroup.get();
            existingGroup.setGroupName(groupDetails.getGroupName());
            groupService.saveGroup(existingGroup);
            return "Group updated successfully!";
        } else {
            return "Group not found!";
        }
    }

    // ✅ Delete a group
    @DeleteMapping("/{id}")
    public String deleteGroup(@PathVariable String id) {
        groupService.deleteGroup(id);
        return "Group deleted successfully!";
    }

    // ✅ Update a group using course ID
    @PutMapping("/course/{courseId}/{groupId}")
    public String updateGroupByCourseId(
        @PathVariable String courseId,
        @PathVariable String groupId,
        @RequestBody Group groupDetails
    ) {
        Optional<Course> course = courseService.getCourseById(courseId);
        if (course.isPresent()) {
            Optional<Group> optionalGroup = groupService.getGroupById(groupId);
            if (optionalGroup.isPresent()) {
                Group existingGroup = optionalGroup.get();
                existingGroup.setGroupName(groupDetails.getGroupName());
                groupService.saveGroup(existingGroup);
                return "Group updated successfully!";
            } else {
                return "Group not found in this course!";
            }
        } else {
            return "Course not found!";
        }
    }

    // ✅ Delete a group using course ID
    @DeleteMapping("/course/{courseId}/{groupId}")
    public String deleteGroupByCourseId(
        @PathVariable String courseId,
        @PathVariable String groupId
    ) {
        Optional<Course> course = courseService.getCourseById(courseId);
        if (course.isPresent()) {
            Optional<Group> optionalGroup = groupService.getGroupById(groupId);
            if (optionalGroup.isPresent()) {
                groupService.deleteGroup(groupId);
                return "Group deleted successfully!";
            } else {
                return "Group not found in this course!";
            }
        } else {
            return "Course not found!";
        }
    }

    // ✅ Get distinct group names from AllClassAssignment collection
@GetMapping("/from-classes")
public List<String> getDistinctGroupsFromAllClassAssignments() {
    return allClassAssignmentRepository.findDistinctGroupNames();
}

}
