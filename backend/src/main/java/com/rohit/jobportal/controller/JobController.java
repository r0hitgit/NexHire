package com.rohit.jobportal.controller;

import com.rohit.jobportal.entity.Job;
import com.rohit.jobportal.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // Only RECRUITER or ADMIN can create job
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    // All roles can view jobs
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // Recruiter can see only their jobs
    @GetMapping("/my-jobs")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<List<Job>> getMyJobs() {
        return ResponseEntity.ok(jobService.getMyJobs());
    }

    // Get single job by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER') or hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_CANDIDATE')")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    // Delete job
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok().build();
    }
    // Recruiter → Edit job
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_RECRUITER')")
    public ResponseEntity<Job> updateJob(@PathVariable Long id, @RequestBody Job updatedJob) {
        return ResponseEntity.ok(jobService.updateJob(id, updatedJob));
    }
}