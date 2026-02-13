package com.example.newsAPI.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.newsAPI.HeroImageEntity.HeroImage;

public interface HeroImageService {
    List<HeroImage> getAllHeroImages();

    List<HeroImage> addHeroImages(MultipartFile[] files);

    void deleteHeroImage(int id);
}
