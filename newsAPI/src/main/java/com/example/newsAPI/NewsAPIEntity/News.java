package com.example.newsAPI.NewsAPIEntity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;

    @javax.persistence.Column(columnDefinition = "TEXT")
    private String content;

    @javax.persistence.Column(columnDefinition = "TEXT")
    private String summary;
    private String eventDate;
    private String category;
    private String imageURL;
    private String imageCaption;
    private String publishDate;
    private String author;
    private String status;
    private String visibility;
    private boolean isActive;

    public News(int i, String string, String string2, String string3, String string4, boolean b) {
        id = i;
        title = string;
        content = string2;
        imageURL = string3;
        publishDate = string4;
        isActive = b;
    }
}
