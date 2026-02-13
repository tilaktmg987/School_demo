package com.example.newsAPI.NoticeAPIService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.newsAPI.NoticeAPIEntity.Notice;
import com.example.newsAPI.repository.NoticeRepository;
import com.example.newsAPI.service.CloudinaryService;

@Service
public class NoticeAPIServiceImp implements NoticeAPIService {

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private CloudinaryService cloudinaryService;

    @Override
    public List<Notice> getNotices() {
        return noticeRepository.findAll();
    }

    @Override
    public Notice getNoticeById(int id) {
        return noticeRepository.findById(id).orElse(null);
    }

    @Override
    public Notice addNotice(Notice notice, MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String pdfUrl = cloudinaryService.uploadRawFile(file);
            notice.setPdfUrl(pdfUrl);
        }
        return noticeRepository.save(notice);
    }

    @Override
    public Notice updateNotice(int id, Notice notice, MultipartFile file) {
        Notice existingNotice = noticeRepository.findById(id).orElse(null);
        if (existingNotice != null) {
            existingNotice.setTitle(notice.getTitle());
            existingNotice.setPublishDate(notice.getPublishDate());
            existingNotice.setActive(notice.isActive());
            if (file != null && !file.isEmpty()) {
                if (existingNotice.getPdfUrl() != null) {
                    cloudinaryService.deleteRawFile(existingNotice.getPdfUrl());
                }
                String pdfUrl = cloudinaryService.uploadRawFile(file);
                existingNotice.setPdfUrl(pdfUrl);
            } else if (notice.getPdfUrl() != null) {
                existingNotice.setPdfUrl(notice.getPdfUrl());
            }
            return noticeRepository.save(existingNotice);
        }
        return null;
    }

    @Override
    public void deleteNotice(int id) {
        Notice notice = noticeRepository.findById(id).orElse(null);
        if (notice != null && notice.getPdfUrl() != null) {
            cloudinaryService.deleteRawFile(notice.getPdfUrl());
        }
        noticeRepository.deleteById(id);
    }
}
