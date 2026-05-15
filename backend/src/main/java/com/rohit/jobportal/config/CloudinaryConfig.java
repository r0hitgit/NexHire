package com.rohit.jobportal.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary("cloudinary://783139348564715:qlEzwqTLKOWwToqzt_GKy5NtHQY@djmtdgsfg");
    }
}