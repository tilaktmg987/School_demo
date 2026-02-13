package com.example.newsAPI.EventAPIService;

import java.util.List;
import com.example.newsAPI.EventAPIEntity.Event;

import org.springframework.web.multipart.MultipartFile;

public interface EventAPIService {

    public List<Event> getEvents();

    public Event addEvent(Event event, MultipartFile file);

    public Event updateEvent(int id, Event event, MultipartFile file);

    public void deleteEvent(int id);
}
