package com.rohit.jobportal.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Async
    public void sendOtp(String toEmail, String otp) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject("JobPortal - Email Verification OTP");
            message.setText(
                    "Hello!\n\n" +
                            "Your OTP for JobPortal email verification is:\n\n" +
                            "  " + otp + "\n\n" +
                            "This OTP is valid for 10 minutes.\n\n" +
                            "If you did not register on JobPortal, please ignore this email.\n\n" +
                            "Regards,\nJobPortal Team"
            );
            message.setFrom("rv87919@gmail.com");
            mailSender.send(message);
            System.out.println("=== OTP EMAIL SENT to: " + toEmail);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }
    }
}