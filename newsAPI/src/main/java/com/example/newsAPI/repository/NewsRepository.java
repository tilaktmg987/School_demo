package com.example.newsAPI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.newsAPI.NewsAPIEntity.News;

@Repository
public interface NewsRepository extends JpaRepository<News, Integer> {

}
