package com.example.newsAPI.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.newsAPI.HeroImageEntity.HeroImage;
import com.example.newsAPI.service.HeroImageService;

@RestController
@RequestMapping("/hero-images")
@CrossOrigin(origins = "*")
public class HeroImageController {

    @Autowired
    private HeroImageService heroImageService;

    @GetMapping
    public List<HeroImage> getAllHeroImages() {
        return heroImageService.getAllHeroImages();
    }

    @PostMapping
    public ResponseEntity<?> addHeroImages(@RequestParam("files") MultipartFile[] files) {
        try {
            List<HeroImage> savedImages = heroImageService.addHeroImages(files);
            return ResponseEntity.ok(savedImages);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHeroImage(@PathVariable int id) {
        heroImageService.deleteHeroImage(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}
