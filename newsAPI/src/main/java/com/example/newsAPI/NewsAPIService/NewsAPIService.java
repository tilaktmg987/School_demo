package com.example.newsAPI.NewsAPIService;

import java.util.List;

import com.example.newsAPI.NewsAPIEntity.News;
import org.springframework.web.multipart.MultipartFile;

public interface NewsAPIService {

    public List<News> getNews();

    public News getNewsById(int id);

    public News addNews(News news, MultipartFile file);

    public News updateNews(int id, News news, MultipartFile file);

    public void deleteNews(int id);

}