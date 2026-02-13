package com.example.newsAPI.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return (String) uploadResult.get("url");
        } catch (IOException e) {
            throw new RuntimeException("Could not upload file to Cloudinary", e);
        }
    }

    /** Upload PDF or other raw file (not image). Use for notices. */
    public String uploadRawFile(MultipartFile file) {
        try {
            Map options = ObjectUtils.asMap("resource_type", "raw");
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            return (String) uploadResult.get("url");
        } catch (IOException e) {
            throw new RuntimeException("Could not upload PDF to Cloudinary", e);
        }
    }

    public void deleteFile(String imageUrl) {
        try {
            // Extract public_id from the Cloudinary URL
            // URL format:
            // https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{format}
            if (imageUrl != null && imageUrl.contains("cloudinary.com")) {
                String[] parts = imageUrl.split("/");
                String fileNameWithExtension = parts[parts.length - 1];
                String publicId = fileNameWithExtension.substring(0, fileNameWithExtension.lastIndexOf('.'));

                // Delete from Cloudinary
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }
        } catch (Exception e) {
            System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
        }
    }

    /** Delete raw file (e.g. PDF) from Cloudinary. */
    public void deleteRawFile(String fileUrl) {
        try {
            if (fileUrl != null && fileUrl.contains("cloudinary.com")) {
                String[] parts = fileUrl.split("/");
                String fileNameWithExtension = parts[parts.length - 1];
                int dot = fileNameWithExtension.lastIndexOf('.');
                String publicId = dot > 0 ? fileNameWithExtension.substring(0, dot) : fileNameWithExtension;
                cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "raw"));
            }
        } catch (Exception e) {
            System.err.println("Failed to delete file from Cloudinary: " + e.getMessage());
        }
    }
}
