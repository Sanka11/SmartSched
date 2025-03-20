package com.smartsched.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "events")
public class Event {
    @Id
    private String eventId;
    private String eventName;
    private LocalDateTime eventDate;
    private LocalDateTime eventTime;
    private String eventMode;
    private String location;
    private String orgCommittee;
    private String description;
}

