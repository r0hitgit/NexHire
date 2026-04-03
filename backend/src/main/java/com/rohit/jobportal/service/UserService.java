package com.rohit.jobportal.service;

import com.rohit.jobportal.dto.LoginRequest;
import com.rohit.jobportal.dto.RegisterRequest;
import com.rohit.jobportal.dto.UserResponse;
import com.rohit.jobportal.entity.Role;
import com.rohit.jobportal.entity.User;
import com.rohit.jobportal.repository.UserRepository;
import com.rohit.jobportal.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    // REGISTER USER
    public UserResponse registerUser(RegisterRequest request) {

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        // Generate 6-digit OTP
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        user.setOtp(otp);
        user.setVerified(false);

        userRepository.save(user);

        // Send OTP email
        emailService.sendOtp(request.getEmail(), otp);

        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole().name());
    }

    // VERIFY OTP
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

        return "Email verified successfully!";
    }

    // LOGIN USER
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

    // GET ALL USERS
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    // MAP USER → RESPONSE
    private UserResponse mapToUserResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
        );
    }
}