package com.smartsched.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Document(collection = "events")
public class Event {
    @Id
    private String eventId;
    private String eventName;
    private LocalDate eventDate;  // stores only the date
    private LocalTime eventTime;  // stores only the time
    private String eventMode;
    private String location;
    private String orgCommittee;
    private String description;
}
