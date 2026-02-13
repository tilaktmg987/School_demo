package com.example.newsAPI.NoticeAPIController;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.example.newsAPI.NoticeAPIEntity.Notice;
import com.example.newsAPI.NoticeAPIService.NoticeAPIService;

@RestController
@CrossOrigin(origins = "*")
public class NoticeAPIController {

    @Autowired
    private NoticeAPIService noticeAPIService;

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/notices")
    public List<Notice> getNotices() {
        return noticeAPIService.getNotices();
    }

    @GetMapping("/notices/{id}")
    public Notice getNoticeById(@PathVariable int id) {
        return noticeAPIService.getNoticeById(id);
    }

    /** Download notice PDF so browser saves as file (not open in tab). */
    @GetMapping("/notices/{id}/download")
    public ResponseEntity<byte[]> downloadNoticePdf(@PathVariable int id) {
        Notice notice = noticeAPIService.getNoticeById(id);
        if (notice == null || notice.getPdfUrl() == null || notice.getPdfUrl().isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        try {
            byte[] pdfBytes = restTemplate.getForObject(notice.getPdfUrl(), byte[].class);
            if (pdfBytes == null) {
                return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).build();
            }
            String filename = "notice-" + id + ".pdf";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", filename);
            headers.setContentLength(pdfBytes.length);
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping(value = "/notices")
    public Notice addNotice(
            @RequestPart("notice") Notice notice,
            @RequestPart(value = "file", required = true) MultipartFile file) {
        return noticeAPIService.addNotice(notice, file);
    }

    @PutMapping(value = "/notices/{id}")
    public Notice updateNotice(
            @PathVariable int id,
            @RequestPart("notice") Notice notice,
            @RequestPart(value = "file", required = false) MultipartFile file) {
        return noticeAPIService.updateNotice(id, notice, file);
    }

    @DeleteMapping("/notices/{id}")
    public void deleteNotice(@PathVariable int id) {
        noticeAPIService.deleteNotice(id);
    }
}
