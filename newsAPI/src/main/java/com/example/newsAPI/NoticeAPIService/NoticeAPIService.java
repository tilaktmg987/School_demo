package com.example.newsAPI.NoticeAPIService;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.newsAPI.NoticeAPIEntity.Notice;

public interface NoticeAPIService {

    public List<Notice> getNotices();

    public Notice getNoticeById(int id);

    public Notice addNotice(Notice notice, MultipartFile file);

    public Notice updateNotice(int id, Notice notice, MultipartFile file);

    public void deleteNotice(int id);
}
