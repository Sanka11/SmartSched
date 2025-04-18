package com.smartsched.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendRegistrationEmail(String toEmail, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Registration Successful");
        message.setText("Hi " + name + ",\n\nWelcome to SmartSched! Your registration was successful.\n\nCheers,\nThe SmartSched Team");
        message.setFrom("your_email@gmail.com");
        mailSender.send(message);
    }
}
