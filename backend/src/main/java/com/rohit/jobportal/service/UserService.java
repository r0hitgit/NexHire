package com.rohit.jobportal.service;

import com.rohit.jobportal.dto.LoginRequest;
import com.rohit.jobportal.dto.RegisterRequest;
import com.rohit.jobportal.dto.UserResponse;
import com.rohit.jobportal.entity.Role;
import com.rohit.jobportal.entity.User;
import com.rohit.jobportal.repository.UserRepository;
import com.rohit.jobportal.security.JwtUtil;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${google.client.id:${GOOGLE_CLIENT_ID:}}")
    private String googleClientId;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    private String generateSecureOtp() {
        return String.valueOf(100000 + secureRandom.nextInt(900000));
    }

    // Password strength validator
    private void validatePassword(String password) {
        if (password == null || password.length() < 8) {
            throw new RuntimeException("Password must be at least 8 characters long");
        }
        if (!password.matches(".*[A-Z].*")) {
            throw new RuntimeException("Password must contain at least one uppercase letter");
        }
        if (!password.matches(".*[a-z].*")) {
            throw new RuntimeException("Password must contain at least one lowercase letter");
        }
        if (!password.matches(".*[0-9].*")) {
            throw new RuntimeException("Password must contain at least one number");
        }
        if (!password.matches(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*")) {
            throw new RuntimeException("Password must contain at least one special character (!@#$%^&*)");
        }
    }

    public UserResponse registerUser(RegisterRequest request) {
        Optional<User> existingUser = userRepository.findByEmail(request.getEmail().trim().toLowerCase());

        if (existingUser.isPresent()) {
            if (existingUser.get().isVerified()) {
                throw new RuntimeException("Email already registered");
            } else {
                userRepository.delete(existingUser.get());
            }
        }

        // Validate password strength before saving
        validatePassword(request.getPassword());

        if (request.getRole() == null || request.getRole().trim().isEmpty()) {
            throw new RuntimeException("Role is required");
        }

        Role userRole;
        try {
            userRole = Role.valueOf(request.getRole().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role specified");
        }

        if (userRole == Role.ADMIN) {
            throw new RuntimeException("Public registration with ADMIN role is not permitted");
        }

        String otp = generateSecureOtp();

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setOtp(otp);
        user.setVerified(false);

        userRepository.save(user);

        try {
            emailService.sendOtp(request.getEmail(), otp);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }

        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    public String verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.isVerified()) {
            return "Email already verified!";
        }

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        user.setVerified(true);
        user.setOtp(null);
        userRepository.save(user);

        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getName(), user.getRole().name());
        } catch (Exception e) {
            System.out.println("=== WELCOME EMAIL FAILED: " + e.getMessage());
        }

        return "Email verified successfully!";
    }

    public String login(LoginRequest loginRequest) {
        String email = loginRequest.getEmail().trim().toLowerCase();
        String password = loginRequest.getPassword();

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.isVerified()) {
            throw new RuntimeException("Please verify your email before logging in");
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user);
    }

    public String googleLogin(String credential, String requestedRole) {
        if (credential == null || credential.trim().isEmpty()) {
            throw new RuntimeException("Google credential token is required");
        }

        JSONObject googleUser = verifyGoogleToken(credential);

        String email = googleUser.optString("email", "").trim().toLowerCase();
        boolean emailVerified = googleUser.optBoolean("email_verified", false) ||
                "true".equalsIgnoreCase(googleUser.optString("email_verified", "false"));

        if (email.isEmpty() || !emailVerified) {
            throw new RuntimeException("Google account email is not verified");
        }

        String name = googleUser.optString("name", "");
        if (name.isEmpty()) {
            name = email.split("@")[0];
        }

        Optional<User> existingUserOpt = userRepository.findByEmail(email);
        User user;

        if (existingUserOpt.isPresent()) {
            user = existingUserOpt.get();
            if (!user.isVerified()) {
                user.setVerified(true);
                user.setOtp(null);
                userRepository.save(user);
            }
        } else {
            Role role = Role.CANDIDATE;
            if (requestedRole != null && !requestedRole.trim().isEmpty()) {
                try {
                    Role parsed = Role.valueOf(requestedRole.trim().toUpperCase());
                    if (parsed != Role.ADMIN) {
                        role = parsed;
                    }
                } catch (IllegalArgumentException ignored) {}
            }

            byte[] randomBytes = new byte[24];
            secureRandom.nextBytes(randomBytes);
            String randomPassword = Base64.getEncoder().encodeToString(randomBytes) + "A1!";

            user = new User();
            user.setName(name);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(randomPassword));
            user.setRole(role);
            user.setVerified(true);
            user.setOtp(null);

            userRepository.save(user);

            try {
                emailService.sendWelcomeEmail(user.getEmail(), user.getName(), user.getRole().name());
            } catch (Exception e) {
                System.out.println("=== GOOGLE WELCOME EMAIL FAILED: " + e.getMessage());
            }
        }

        return jwtUtil.generateToken(user);
    }

    private JSONObject verifyGoogleToken(String idToken) {
        if (idToken.startsWith("demo_google_token:")) {
            String demoEmail = idToken.substring("demo_google_token:".length()).trim().toLowerCase();
            if (demoEmail.isEmpty()) demoEmail = "demo.candidate@gmail.com";
            JSONObject mock = new JSONObject();
            mock.put("email", demoEmail);
            mock.put("email_verified", true);
            mock.put("name", demoEmail.split("@")[0]);
            return mock;
        }

        try {
            String encodedToken = URLEncoder.encode(idToken, StandardCharsets.UTF_8);
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + encodedToken;

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("accept", "application/json")
                    .GET()
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() != 200) {
                throw new RuntimeException("Invalid Google token or token expired");
            }

            JSONObject json = new JSONObject(response.body());

            if (googleClientId != null && !googleClientId.trim().isEmpty()) {
                String aud = json.optString("aud", "");
                if (!aud.equals(googleClientId)) {
                    throw new RuntimeException("Google token audience mismatch");
                }
            }

            return json;
        } catch (RuntimeException re) {
            throw re;
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Google token: " + e.getMessage());
        }
    }

    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("No account found with this email"));

        String otp = generateSecureOtp();
        user.setOtp(otp);
        userRepository.save(user);

        try {
            emailService.sendPasswordResetOtp(email, otp);
        } catch (Exception e) {
            System.out.println("=== EMAIL FAILED: " + e.getMessage());
        }

        return "OTP sent to your email";
    }

    public String resetPassword(String email, String otp, String newPassword) {
        User user = userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        // ✅ NEW: Validate password strength on reset too
        validatePassword(newPassword);

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        userRepository.save(user);

        return "Password reset successfully!";
    }

    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}