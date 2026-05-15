package com.rohit.jobportal.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "job_id")
    @JsonIgnoreProperties({"applications", "recruiter"})
    private Job job;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    @JsonIgnoreProperties({"password"})
    private User candidate;

    @Enumerated(EnumType.STRING)
    private ApplicationStatus status;

    private LocalDate appliedDate;

    // Resume stored on Cloudinary
    private String resumeUrl;

    // Interview scheduling
    private LocalDateTime interviewScheduledAt;

    @Column(length = 1000)
    private String interviewDetails;

    @PrePersist
    protected void onApply() {
        this.appliedDate = LocalDate.now();
    }
}