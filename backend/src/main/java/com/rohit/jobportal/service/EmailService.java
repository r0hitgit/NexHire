package com.rohit.jobportal.service;

import org.json.JSONArray;
import org.json.JSONObject;
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

    private String createEmailPayload(String toEmail, String toName, String subject, String textContent) {
        JSONObject payload = new JSONObject();
        payload.put("sender", new JSONObject().put("name", "NexHire").put("email", "rv87919@gmail.com"));

        JSONObject recipient = new JSONObject().put("email", toEmail);
        if (toName != null && !toName.trim().isEmpty()) {
            recipient.put("name", toName);
        }
        payload.put("to", new JSONArray().put(recipient));
        payload.put("subject", subject);
        payload.put("textContent", textContent);
        return payload.toString();
    }

    @Async
    public void sendOtp(String toEmail, String otp) {
        try {
            String text = "Hello!\n\nYour OTP for NexHire email verification is:\n\n  " + otp +
                    "\n\nThis OTP is valid for 10 minutes.\n\nIf you did not register on NexHire, please ignore this email.\n\nRegards,\nNexHire Team";
            String body = createEmailPayload(toEmail, null, "NexHire - Email Verification OTP", text);
            sendBrevoRequest(body, "OTP EMAIL SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetOtp(String toEmail, String otp) {
        try {
            String text = "Hello!\n\nYour OTP for password reset is:\n\n  " + otp +
                    "\n\nThis OTP is valid for 10 minutes.\n\nIf you did not request a password reset, please ignore this email.\n\nRegards,\nNexHire Team";
            String body = createEmailPayload(toEmail, null, "NexHire - Password Reset OTP", text);
            sendBrevoRequest(body, "PASSWORD RESET OTP SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String toEmail, String name, String role) {
        try {
            String roleMessage = "RECRUITER".equals(role)
                    ? "You can now post jobs, manage applications, and find the perfect candidates for your team."
                    : "You can now browse hundreds of job opportunities and track your applications in real time.";

            String text = "Hi " + name + ",\n\nWelcome to NexHire! We're thrilled to have you on board.\n\n" +
                    roleMessage + "\n\nHere's what you can do next:\n\n1. Complete your profile\n2. Explore the platform\n3. Take the next step in your career journey\n\nIf you have any questions, feel free to reach out to us.\n\nBest regards,\nThe NexHire Team\n\nhttps://nexhire.me";

            String body = createEmailPayload(toEmail, name, "Welcome to NexHire — Your Journey Starts Here! 🚀", text);
            sendBrevoRequest(body, "WELCOME EMAIL SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    // Status update email (shortlisted / rejected)
    @Async
    public void sendStatusUpdateEmail(String toEmail, String name, String jobTitle, String status) {
        try {
            String emoji = "Shortlisted".equals(status) ? "🎉" : "📋";
            String message = "Shortlisted".equals(status)
                    ? "Great news! You have been shortlisted for the role. The recruiter will be in touch with next steps soon."
                    : "Thank you for your interest. After careful consideration, the recruiter has decided not to move forward with your application at this time. Don't be discouraged — keep applying!";

            String subject = emoji + " Application Update: " + jobTitle + " — " + status;
            String text = "Hi " + name + ",\n\n" + message + "\n\nJob: " + jobTitle + "\n\n" +
                    "You can track all your applications at https://nexhire.me\n\nBest regards,\nThe NexHire Team";

            String body = createEmailPayload(toEmail, name, subject, text);
            sendBrevoRequest(body, "STATUS UPDATE EMAIL SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    // Interview scheduled email
    @Async
    public void sendInterviewScheduledEmail(String toEmail, String name, String jobTitle,
                                            LocalDateTime interviewAt, String details) {
        try {
            String formattedDate = interviewAt.format(
                    DateTimeFormatter.ofPattern("EEEE, MMMM d yyyy 'at' h:mm a")
            );

            String subject = "📅 Interview Scheduled — " + jobTitle;
            String text = "Hi " + name + ",\n\nCongratulations! Your interview has been scheduled.\n\nJob: " + jobTitle +
                    "\nDate & Time: " + formattedDate + "\n\nDetails:\n" + details +
                    "\n\nPlease make sure to be available at the scheduled time. You can view your application status at https://nexhire.me\n\nBest of luck!\n\nBest regards,\nThe NexHire Team";

            String body = createEmailPayload(toEmail, name, subject, text);
            sendBrevoRequest(body, "INTERVIEW EMAIL SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }

    // Recruiter contact email
    @Async
    public void sendRecruiterContactEmail(String toEmail, String candidateName,
                                          String recruiterName, String jobTitle,
                                          String subject, String message) {
        try {
            String text = "Hi " + candidateName + ",\n\nYou have received a message from " + recruiterName +
                    " regarding your application for " + jobTitle + ".\n\n--- Message ---\n" + message +
                    "\n---------------\n\nYou can view your application at https://nexhire.me\n\nBest regards,\nThe NexHire Team";

            String body = createEmailPayload(toEmail, candidateName, subject, text);
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