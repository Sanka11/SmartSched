package com.smartsched.service;

import com.smartsched.model.Group;
import com.smartsched.repository.GroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GroupService {

    @Autowired
    private GroupRepository groupRepository;

    public List<Group> getAllGroups() {
        return groupRepository.findAll();
    }

    public Optional<Group> getGroupById(String id) {
        return groupRepository.findById(id);
    }

    public List<Group> getGroupsByCourseId(String courseId) {
        return groupRepository.findByCourse_CourseId(courseId);
    }

    public Group saveGroup(Group group) {
        return groupRepository.save(group);
    }

    public void deleteGroup(String id) {
        groupRepository.deleteById(id);
    }
}
