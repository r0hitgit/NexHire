package com.rohit.jobportal.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.rohit.jobportal.entity.*;
import com.rohit.jobportal.repository.ApplicationRepository;
import com.rohit.jobportal.repository.JobRepository;
import com.rohit.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.net.URI;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;
    private final EmailService emailService;

    @Value("${cloudinary.cloud-name:${CLOUDINARY_CLOUD_NAME:djmtdgsfg}}")
    private String cloudName;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository,
                              Cloudinary cloudinary,
                              EmailService emailService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.cloudinary = cloudinary;
        this.emailService = emailService;
    }

    // Candidate → Apply for Job with optional resume
    public Application applyForJob(Long jobId, MultipartFile resume) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (candidate.getRole() != Role.CANDIDATE) {
            throw new RuntimeException("Only candidates can apply for jobs");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        applicationRepository.findByJobAndCandidate(job, candidate)
                .ifPresent(a -> {
                    throw new RuntimeException("You already applied to this job");
                });

        Application application = new Application();
        application.setJob(job);
        application.setCandidate(candidate);
        application.setStatus(ApplicationStatus.APPLIED);

        if (resume != null && !resume.isEmpty()) {
            validateResumeFile(resume);
            String resumeUrl = uploadResume(resume, candidate.getName());
            application.setResumeUrl(resumeUrl);
        }

        return applicationRepository.save(application);
    }

    // Validate resume file size, extension, and MIME type
    private void validateResumeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return;
        }

        // 1. Max size: 5MB
        long maxSizeBytes = 5L * 1024 * 1024;
        if (file.getSize() > maxSizeBytes) {
            throw new RuntimeException("Resume file size must be less than 5MB");
        }

        // 2. Validate file extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.contains(".")) {
            throw new RuntimeException("Invalid file name");
        }

        String extension = originalFilename.substring(originalFilename.lastIndexOf('.')).toLowerCase();
        if (!extension.equals(".pdf") && !extension.equals(".doc") && !extension.equals(".docx")) {
            throw new RuntimeException("Invalid file type. Only PDF and Word documents (.pdf, .doc, .docx) are permitted");
        }

        // 3. Validate Content-Type
        String contentType = file.getContentType();
        if (contentType != null) {
            String ct = contentType.toLowerCase();
            boolean isValidMime = ct.equals("application/pdf") ||
                    ct.equals("application/msword") ||
                    ct.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
                    ct.equals("application/octet-stream");
            if (!isValidMime) {
                throw new RuntimeException("Invalid MIME type: Only PDF and Word documents are permitted");
            }
        }
    }

    // Upload resume by candidate
    private String uploadResume(MultipartFile file, String candidateName) {
        try {
            String uploadPreset = "nexhire_resumes";
            String boundary = "----FormBoundary" + System.currentTimeMillis();

            java.io.ByteArrayOutputStream baos = new java.io.ByteArrayOutputStream();
            String prefix = "--" + boundary + "\r\n";

            // upload_preset field
            baos.write((prefix + "Content-Disposition: form-data; name=\"upload_preset\"\r\n\r\n" + uploadPreset + "\r\n").getBytes());
            // file field
            baos.write((prefix + "Content-Disposition: form-data; name=\"file\"; filename=\"resume.pdf\"\r\nContent-Type: application/pdf\r\n\r\n").getBytes());
            baos.write(file.getBytes());
            baos.write(("\r\n--" + boundary + "--\r\n").getBytes());

            byte[] body = baos.toByteArray();

            java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                    .uri(URI.create("https://api.cloudinary.com/v1_1/" + cloudName + "/raw/upload"))
                    .header("Content-Type", "multipart/form-data; boundary=" + boundary)
                    .POST(java.net.http.HttpRequest.BodyPublishers.ofByteArray(body))
                    .build();

            java.net.http.HttpResponse<String> response = java.net.http.HttpClient.newHttpClient()
                    .send(request, java.net.http.HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                org.json.JSONObject json = new org.json.JSONObject(response.body());
                return json.getString("secure_url");
            } else {
                throw new RuntimeException("Cloudinary upload failed: " + response.body());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload resume: " + e.getMessage());
        }
    }

    // Candidate → View my applications
    public List<Application> getMyApplications() {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return applicationRepository.findByCandidate(candidate);
    }

    // Helper: Verify recruiter ownership or admin
    private void verifyRecruiterOrAdmin(Application application) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = application.getJob().getRecruiter() != null &&
                application.getJob().getRecruiter().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized: You do not have permission to perform this action");
        }
    }

    // Recruiter / Admin → View applicants for a job
    public List<Application> getApplicationsForJob(Long jobId) {

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        boolean isOwner = job.getRecruiter() != null && job.getRecruiter().getId().equals(currentUser.getId());
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized: You can only view applicants for your own jobs");
        }

        return applicationRepository.findByJob(job);
    }

    // Recruiter / Admin → Update application status
    public Application updateApplicationStatus(Long applicationId, ApplicationStatus status) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        verifyRecruiterOrAdmin(application);

        application.setStatus(status);
        applicationRepository.save(application);

        String candidateEmail = application.getCandidate().getEmail();
        String candidateName  = application.getCandidate().getName();
        String jobTitle       = application.getJob().getTitle();

        if (status == ApplicationStatus.SHORTLISTED) {
            emailService.sendStatusUpdateEmail(candidateEmail, candidateName, jobTitle, "Shortlisted");
        } else if (status == ApplicationStatus.REJECTED) {
            emailService.sendStatusUpdateEmail(candidateEmail, candidateName, jobTitle, "Rejected");
        }

        return application;
    }

    // Recruiter / Admin → Schedule interview
    public Application scheduleInterview(Long applicationId,
                                         LocalDateTime interviewAt,
                                         String details) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        verifyRecruiterOrAdmin(application);

        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        application.setInterviewScheduledAt(interviewAt);
        application.setInterviewDetails(details);
        applicationRepository.save(application);

        emailService.sendInterviewScheduledEmail(
                application.getCandidate().getEmail(),
                application.getCandidate().getName(),
                application.getJob().getTitle(),
                interviewAt,
                details
        );

        return application;
    }

    // Recruiter / Admin → Contact candidate
    public void contactCandidate(Long applicationId, String subject, String message) {

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        verifyRecruiterOrAdmin(application);

        String recruiterName = application.getJob().getRecruiter().getName();

        emailService.sendRecruiterContactEmail(
                application.getCandidate().getEmail(),
                application.getCandidate().getName(),
                recruiterName,
                application.getJob().getTitle(),
                subject,
                message
        );
    }
    // Candidate → Withdraw application
    public void withdrawApplication(Long applicationId) {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User candidate = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getCandidate().getId().equals(candidate.getId())) {
            throw new RuntimeException("You can only withdraw your own applications");
        }

        applicationRepository.delete(application);
    }
}