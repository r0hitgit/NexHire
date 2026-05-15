package com.rohit.jobportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Async
    public void sendOtp(String toEmail, String otp) {
        try {
            String body = String.format("""
                {
                    "sender": {"name": "NexHire", "email": "rv87919@gmail.com"},
                    "to": [{"email": "%s"}],
                    "subject": "NexHire - Email Verification OTP",
                    "textContent": "Hello!\\n\\nYour OTP for NexHire email verification is:\\n\\n  %s\\n\\nThis OTP is valid for 10 minutes.\\n\\nIf you did not register on NexHire, please ignore this email.\\n\\nRegards,\\nNexHire Team"
                }
                """, toEmail, otp);

            sendBrevoRequest(body, "OTP EMAIL SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetOtp(String toEmail, String otp) {
        try {
            String body = String.format("""
                {
                    "sender": {"name": "NexHire", "email": "rv87919@gmail.com"},
                    "to": [{"email": "%s"}],
                    "subject": "NexHire - Password Reset OTP",
                    "textContent": "Hello!\\n\\nYour OTP for password reset is:\\n\\n  %s\\n\\nThis OTP is valid for 10 minutes.\\n\\nIf you did not request a password reset, please ignore this email.\\n\\nRegards,\\nNexHire Team"
                }
                """, toEmail, otp);

            sendBrevoRequest(body, "PASSWORD RESET OTP SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String name, String role) {
        try {
            String roleMessage = role.equals("RECRUITER")
                    ? "You can now post jobs, manage applications, and find the perfect candidates for your team."
                    : "You can now browse hundreds of job opportunities and track your applications in real time.";

            String body = String.format("""
                {
                    "sender": {"name": "NexHire", "email": "rv87919@gmail.com"},
                    "to": [{"email": "%s", "name": "%s"}],
                    "subject": "Welcome to NexHire — Your Journey Starts Here! 🚀",
                    "textContent": "Hi %s,\\n\\nWelcome to NexHire! We're thrilled to have you on board.\\n\\n%s\\n\\nHere's what you can do next:\\n\\n1. Complete your profile\\n2. Explore the platform\\n3. Take the next step in your career journey\\n\\nIf you have any questions, feel free to reach out to us.\\n\\nBest regards,\\nThe NexHire Team\\n\\nhttps://nexhire.me"
                }
                """, toEmail, name, name, roleMessage);

            sendBrevoRequest(body, "WELCOME EMAIL SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    // NEW: Status update email (shortlisted / rejected)
    @Async
    public void sendStatusUpdateEmail(String toEmail, String name, String jobTitle, String status) {
        try {
            String emoji   = status.equals("Shortlisted") ? "🎉" : "📋";
            String message = status.equals("Shortlisted")
                    ? "Great news! You have been shortlisted for the role. The recruiter will be in touch with next steps soon."
                    : "Thank you for your interest. After careful consideration, the recruiter has decided not to move forward with your application at this time. Don't be discouraged — keep applying!";

            String body = String.format("""
                {
                    "sender": {"name": "NexHire", "email": "rv87919@gmail.com"},
                    "to": [{"email": "%s", "name": "%s"}],
                    "subject": "%s Application Update: %s — %s",
                    "textContent": "Hi %s,\\n\\n%s\\n\\nJob: %s\\n\\n%s\\n\\nYou can track all your applications at https://nexhire.me\\n\\nBest regards,\\nThe NexHire Team"
                }
                """, toEmail, name, emoji, jobTitle, status, name, message, jobTitle, message);

            sendBrevoRequest(body, "STATUS UPDATE EMAIL SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    // NEW: Interview scheduled email
    @Async
    public void sendInterviewScheduledEmail(String toEmail, String name, String jobTitle,
                                            LocalDateTime interviewAt, String details) {
        try {
            String formattedDate = interviewAt.format(
                    DateTimeFormatter.ofPattern("EEEE, MMMM d yyyy 'at' h:mm a")
            );

            String body = String.format("""
                {
                    "sender": {"name": "NexHire", "email": "rv87919@gmail.com"},
                    "to": [{"email": "%s", "name": "%s"}],
                    "subject": "📅 Interview Scheduled — %s",
                    "textContent": "Hi %s,\\n\\nCongratulations! Your interview has been scheduled.\\n\\nJob: %s\\nDate & Time: %s\\n\\nDetails:\\n%s\\n\\nPlease make sure to be available at the scheduled time. You can view your application status at https://nexhire.me\\n\\nBest of luck!\\n\\nBest regards,\\nThe NexHire Team"
                }
                """, toEmail, name, jobTitle, name, jobTitle, formattedDate, details);

            sendBrevoRequest(body, "INTERVIEW EMAIL SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    // NEW: Recruiter contact email
    @Async
    public void sendRecruiterContactEmail(String toEmail, String candidateName,
                                          String recruiterName, String jobTitle,
                                          String subject, String message) {
        try {
            String body = String.format("""
                {
                    "sender": {"name": "NexHire", "email": "rv87919@gmail.com"},
                    "to": [{"email": "%s", "name": "%s"}],
                    "subject": "%s",
                    "textContent": "Hi %s,\\n\\nYou have received a message from %s regarding your application for %s.\\n\\n--- Message ---\\n%s\\n---------------\\n\\nYou can view your application at https://nexhire.me\\n\\nBest regards,\\nThe NexHire Team"
                }
                """, toEmail, candidateName, subject, candidateName, recruiterName, jobTitle, message);

            sendBrevoRequest(body, "RECRUITER CONTACT EMAIL SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    // Shared Brevo HTTP call
    private void sendBrevoRequest(String body, String successLog) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
                    .header("accept", "application/json")
                    .header("api-key", brevoApiKey)
                    .header("content-type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 201) {
                System.out.println("=== " + successLog);
            } else {
                System.out.println("=== EMAIL FAILED: " + response.body());
            }
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }
}