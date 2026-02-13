package com.example.newsAPI.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.newsAPI.HeroImageEntity.HeroImage;

@Repository
public interface HeroImageRepository extends JpaRepository<HeroImage, Integer> {
}
