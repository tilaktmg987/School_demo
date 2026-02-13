package com.example.newsAPI.NewsAPIController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.newsAPI.NewsAPIEntity.News;
import com.example.newsAPI.NewsAPIService.NewsAPIService;

@RestController
@CrossOrigin(origins = "*")
public class NewsAPIController {

    @Autowired
    NewsAPIService newsAPIService;

    @GetMapping("/news")
    public List<News> getNews() {
        return newsAPIService.getNews();
    }

    @GetMapping("/news/{id}")
    public News getNewsById(@PathVariable int id) {
        return newsAPIService.getNewsById(id);
    }

    @PostMapping(value = "/news", consumes = "multipart/form-data")
    public News addNews(
            @RequestPart("news") News news,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return newsAPIService.addNews(news, file);
    }

    @PutMapping(value = "/news/{id}", consumes = "multipart/form-data")
    public News updateNews(
            @PathVariable int id,
            @RequestPart("news") News news,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return newsAPIService.updateNews(id, news, file);
    }

    @DeleteMapping("/news/{id}")
    public void deleteNews(@PathVariable int id) {
        newsAPIService.deleteNews(id);
    }
}
