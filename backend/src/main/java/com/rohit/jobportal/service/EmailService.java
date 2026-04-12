package com.rohit.jobportal.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

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
                System.out.println("=== OTP EMAIL SENT to: " + toEmail);
            } else {
                System.out.println("=== EMAIL FAILED: " + response.body());
            }
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
                System.out.println("=== PASSWORD RESET OTP SENT to: " + toEmail);
            } else {
                System.out.println("=== EMAIL FAILED: " + response.body());
            }
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
                System.out.println("=== WELCOME EMAIL SENT to: " + toEmail);
            } else {
                System.out.println("=== EMAIL FAILED: " + response.body());
            }
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }
}