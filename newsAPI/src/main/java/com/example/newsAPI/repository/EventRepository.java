package com.example.newsAPI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.newsAPI.EventAPIEntity.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {

}
