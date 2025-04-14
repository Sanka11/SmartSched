package com.smartsched.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // ✅ Disable CSRF for frontend API calls
                .cors(Customizer.withDefaults()) // ✅ Enable CORS for localhost
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/api/users/register",
                                "/api/users/login",
                                "/api/users/forgot-password",
                                "/api/custom-schedule/**")
                        .permitAll()

                        .requestMatchers("/api/timetable/**") // ✅ TEMP: allow all timetable routes
                        .permitAll()

                        .requestMatchers("/api/users/**", "/api/schedule/**")
                        .hasAnyRole("SUPERADMIN", "ADMIN")

                        .anyRequest().authenticated())

                .httpBasic(Customizer.withDefaults()); // ✅ for testing with tools or browser

        return http.build();
    }

    // ✅ Password encoder for secure registration/auth
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // ✅ CORS config for frontend at http://localhost:5173
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.setAllowedOrigins(List.of("http://localhost:5173")); // ✅ match your frontend port
        config.setAllowedHeaders(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
