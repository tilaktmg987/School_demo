package com.example.newsAPI.NewsAPIService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.newsAPI.NewsAPIEntity.News;
import com.example.newsAPI.repository.NewsRepository;
import com.example.newsAPI.service.CloudinaryService;

@Service
public class NewsAPIServiceImp implements NewsAPIService {

    @Autowired
    private NewsRepository newsRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public List<News> getNews() {
        return newsRepository.findAll();
    }

    @Override
    public News getNewsById(int id) {
        return newsRepository.findById(id).orElse(null);
    }

    @Override
    public News addNews(News news, MultipartFile file) {
        // Upload image to Cloudinary if file is provided
        if (file != null && !file.isEmpty()) {
            try {
                String imageUrl = cloudinaryService.uploadFile(file);
                news.setImageURL(imageUrl);
            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        }
        return newsRepository.save(news);
    }

    @Override
    public News updateNews(int id, News news, MultipartFile file) {
        News existingNews = newsRepository.findById(id).orElse(null);
        if (existingNews != null) {
            existingNews.setTitle(news.getTitle());
            existingNews.setContent(news.getContent());
            existingNews.setSummary(news.getSummary());
            existingNews.setAuthor(news.getAuthor());
            existingNews.setCategory(news.getCategory());
            existingNews.setEventDate(news.getEventDate());
            existingNews.setPublishDate(news.getPublishDate());
            existingNews.setImageCaption(news.getImageCaption());
            existingNews.setStatus(news.getStatus());
            existingNews.setVisibility(news.getVisibility());
            existingNews.setActive(news.isActive());

            // Upload new image to Cloudinary if file is provided
            if (file != null && !file.isEmpty()) {
                try {
                    String imageUrl = cloudinaryService.uploadFile(file);
                    existingNews.setImageURL(imageUrl);
                } catch (Exception e) {
                    throw new RuntimeException("Failed to upload image: " + e.getMessage());
                }
            } else if (news.getImageURL() != null) {
                // Keep existing URL if no new file is uploaded
                existingNews.setImageURL(news.getImageURL());
            }

            return newsRepository.save(existingNews);
        }
        return null;
    }

    @Override
    public void deleteNews(int id) {
        // Fetch the news to get the image URL before deleting
        News news = newsRepository.findById(id).orElse(null);
        if (news != null && news.getImageURL() != null) {
            // Delete the image from Cloudinary
            cloudinaryService.deleteFile(news.getImageURL());
        }
        // Delete the news from database
        newsRepository.deleteById(id);
    }
}
