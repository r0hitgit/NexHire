package com.rohit.jobportal.service;

import com.rohit.jobportal.entity.Job;
import com.rohit.jobportal.entity.Role;
import com.rohit.jobportal.entity.User;
import com.rohit.jobportal.repository.JobRepository;
import com.rohit.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    // Create Job (Recruiter only)
    public Job createJob(Job job) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        job.setRecruiter(recruiter);
        return jobRepository.save(job);
    }

    // Get All Jobs
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // Get Jobs created by logged-in recruiter
    public List<Job> getMyJobs() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return jobRepository.findByRecruiter(recruiter);
    }

    // Get single job by ID
    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    // Delete job (Owner or Admin only)
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = job.getRecruiter() != null && job.getRecruiter().getEmail().equalsIgnoreCase(email);
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized: You can only delete your own jobs");
        }

        jobRepository.delete(job);
    }

    // Update job (Owner or Admin only)
    public Job updateJob(Long id, Job updatedJob) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        String email = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        boolean isOwner = job.getRecruiter() != null && job.getRecruiter().getEmail().equalsIgnoreCase(email);
        boolean isAdmin = user.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Unauthorized: You can only edit your own jobs");
        }

        job.setTitle(updatedJob.getTitle());
        job.setDescription(updatedJob.getDescription());
        job.setLocation(updatedJob.getLocation());
        job.setSalary(updatedJob.getSalary());
        job.setJobType(updatedJob.getJobType());

        return jobRepository.save(job);
    }
}