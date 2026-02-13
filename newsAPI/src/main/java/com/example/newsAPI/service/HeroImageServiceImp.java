package com.example.newsAPI.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.newsAPI.HeroImageEntity.HeroImage;
import com.example.newsAPI.repository.HeroImageRepository;

@Service
public class HeroImageServiceImp implements HeroImageService {

    @Autowired
    private HeroImageRepository heroImageRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public List<HeroImage> getAllHeroImages() {
        return heroImageRepository.findAll();
    }

    @Override
    public List<HeroImage> addHeroImages(MultipartFile[] files) {
        long currentCount = heroImageRepository.count();
        if (currentCount + files.length > 5) {
            throw new RuntimeException(
                    "Cannot upload " + files.length + " images. Max limit is 5. You have " + currentCount + ".");
        }

        List<HeroImage> savedImages = new java.util.ArrayList<>();
        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            try {
                String imageUrl = cloudinaryService.uploadFile(file);
                HeroImage heroImage = new HeroImage();
                heroImage.setImageURL(imageUrl);
                savedImages.add(heroImageRepository.save(heroImage));
            } catch (Exception e) {
                throw new RuntimeException(
                        "Failed to upload image: " + file.getOriginalFilename() + " - " + e.getMessage());
            }
        }
        return savedImages;
    }

    @Override
    public void deleteHeroImage(int id) {
        // Fetch the hero image to get the URL before deleting
        HeroImage heroImage = heroImageRepository.findById(id).orElse(null);
        if (heroImage != null && heroImage.getImageURL() != null) {
            // Delete the image from Cloudinary
            cloudinaryService.deleteFile(heroImage.getImageURL());
        }
        // Delete the hero image from database
        heroImageRepository.deleteById(id);
    }
}
