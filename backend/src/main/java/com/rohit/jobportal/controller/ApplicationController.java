package com.rohit.jobportal.controller;

import com.rohit.jobportal.entity.Application;
import com.rohit.jobportal.entity.ApplicationStatus;
import com.rohit.jobportal.service.ApplicationService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    // Candidate → Apply for Job (with optional resume)
    @PostMapping(value = "/apply/{jobId}", consumes = {"multipart/form-data"})
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public Application applyForJob(
            @PathVariable Long jobId,
            @RequestPart(value = "resume", required = false) MultipartFile resume) {
        return applicationService.applyForJob(jobId, resume);
    }

    // Candidate → View My Applications
    @GetMapping("/my")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public List<Application> getMyApplications() {
        return applicationService.getMyApplications();
    }

    // Recruiter → View applicants for a job
    @GetMapping("/job/{jobId}")
    @PreAuthorize("isAuthenticated()")
    public List<Application> getApplicationsForJob(@PathVariable Long jobId) {
        return applicationService.getApplicationsForJob(jobId);
    }

    // Recruiter → Update status (shortlist / reject)
    @PutMapping("/{applicationId}/status")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public Application updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status) {
        return applicationService.updateApplicationStatus(applicationId, status);
    }

    // Recruiter → Schedule interview
    @PostMapping("/{applicationId}/schedule-interview")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public Application scheduleInterview(
            @PathVariable Long applicationId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime interviewAt,
            @RequestParam String details) {
        return applicationService.scheduleInterview(applicationId, interviewAt, details);
    }

    // Recruiter → Contact candidate
    @PostMapping("/{applicationId}/contact")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public void contactCandidate(
            @PathVariable Long applicationId,
            @RequestParam String subject,
            @RequestParam String message) {
        applicationService.contactCandidate(applicationId, subject, message);
    }
    // Candidate → Withdraw application
    @DeleteMapping("/{applicationId}")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<Void> withdrawApplication(@PathVariable Long applicationId) {
        applicationService.withdrawApplication(applicationId);
        return ResponseEntity.ok().build();
    }
}