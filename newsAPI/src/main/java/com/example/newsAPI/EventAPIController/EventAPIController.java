package com.example.newsAPI.EventAPIController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.newsAPI.EventAPIEntity.Event;
import com.example.newsAPI.EventAPIService.EventAPIService;

@RestController
@CrossOrigin(origins = "*")
public class EventAPIController {

    @Autowired
    private EventAPIService eventAPIService;

    @GetMapping("/events")
    public List<Event> getEvents() {
        return eventAPIService.getEvents();
    }

    @PostMapping(value = "/events", consumes = "multipart/form-data")
    public Event addEvent(
            @RequestPart("event") Event event,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return eventAPIService.addEvent(event, file);
    }

    @PutMapping(value = "/events/{id}", consumes = "multipart/form-data")
    public Event updateEvent(
            @PathVariable int id,
            @RequestPart("event") Event event,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return eventAPIService.updateEvent(id, event, file);
    }

    @DeleteMapping("/events/{id}")
    public void deleteEvent(@PathVariable int id) {
        eventAPIService.deleteEvent(id);
    }
}
