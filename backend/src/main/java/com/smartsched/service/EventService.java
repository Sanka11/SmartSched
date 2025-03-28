package com.smartsched.service;

import com.smartsched.model.Event;
import com.smartsched.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {
    @Autowired
    private EventRepository eventRepository;

    public Event addEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(String eventId) {
        return eventRepository.findById(eventId).orElse(null);
    }

    public Event updateEvent(String eventId, Event updatedEvent) {
        Event existingEvent = eventRepository.findById(eventId).orElse(null);
        if (existingEvent != null) {
            updatedEvent.setEventId(eventId);
            return eventRepository.save(updatedEvent);
        }
        return null;
    }

    public String deleteEvent(String eventId) {
        eventRepository.deleteById(eventId);
        return "Event deleted successfully!";
    }
}