package com.example.newsAPI.EventAPIService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.newsAPI.EventAPIEntity.Event;
import com.example.newsAPI.repository.EventRepository;
import com.example.newsAPI.service.CloudinaryService;

@Service
public class EventAPIServiceImp implements EventAPIService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public List<Event> getEvents() {
        return eventRepository.findAll();
    }

    @Override
    public Event addEvent(Event event, MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadFile(file);
                event.setImageURL(imageUrl);
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        }
        return eventRepository.save(event);
    }

    @Override
    public Event updateEvent(int id, Event event, MultipartFile file) {
        Event existingEvent = eventRepository.findById(id).orElse(null);
        if (existingEvent != null) {
            existingEvent.setTitle(event.getTitle());
            existingEvent.setActive(event.isActive());

            if (file != null && !file.isEmpty()) {
                try {
                    String imageUrl = cloudinaryService.uploadFile(file);
                    existingEvent.setImageURL(imageUrl);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to upload image: " + e.getMessage());
                }
            } else if (event.getImageURL() != null) {
                existingEvent.setImageURL(event.getImageURL());
            }

            return eventRepository.save(existingEvent);
        }
        return null;
    }

    @Override
    public void deleteEvent(int id) {
        // Fetch the event to get the image URL before deleting
        Event event = eventRepository.findById(id).orElse(null);
        if (event != null && event.getImageURL() != null) {
            // Delete the image from Cloudinary
            cloudinaryService.deleteFile(event.getImageURL());
        }
        // Delete the event from database
        eventRepository.deleteById(id);
    }
}
