package com.example.newsAPI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.newsAPI.NoticeAPIEntity.Notice;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Integer> {

}
