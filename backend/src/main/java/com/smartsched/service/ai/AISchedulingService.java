package com.smartsched.service.ai;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class AISchedulingService {

    public String generateSchedule() {
        try {
            // 🔹 Use Python inside your virtual environment
            ProcessBuilder pb = new ProcessBuilder("/Users/pramodravisanka/myvenv/bin/python3",
                    "src/main/resources/ai/scheduler.py");
            pb.redirectErrorStream(true); // Capture errors too
            Process process = pb.start();

            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println("🔹 Python Output Line: " + line);
                output.append(line).append("\n");
            }

            process.waitFor();

            String result = output.toString().trim();
            System.out.println("✅ Final Output Sent to API: " + result);

            return result.isEmpty() ? "{\"error\": \"Python script returned empty output\"}" : result;
        } catch (Exception e) {
            return "{\"error\": \"Error running AI Scheduler: " + e.getMessage() + "\"}";
        }
    }
}
