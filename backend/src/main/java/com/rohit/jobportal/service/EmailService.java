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
}