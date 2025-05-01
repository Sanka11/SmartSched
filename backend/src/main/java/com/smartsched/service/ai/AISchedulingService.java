package com.smartsched.service.ai;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStreamReader;

@Service
public class AISchedulingService {

    private static final String PYTHON_VENV = "venv/bin/python3";
    private static final String SCRIPT_PATH = "src/main/resources/ai/scheduler.py";

    public String generateSchedule(String email, String role) {
        try {
            // 🔹 Construct the command with arguments
            ProcessBuilder pb = new ProcessBuilder(
                    PYTHON_VENV,
                    SCRIPT_PATH,
                    "--email=" + email,
                    "--role=" + role);

            pb.redirectErrorStream(true); // Merge stdout and stderr

            Process process = pb.start();
            BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
            StringBuilder output = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                System.out.println("🔹 Python Output Line: " + line);
                output.append(line).append("\n");
            }

            int exitCode = process.waitFor();
            System.out.println("🔚 Python script exited with code: " + exitCode);

            String result = output.toString().trim();
            System.out.println("✅ Final Output Sent to API: " + result);

            return result.isEmpty() ? "{\"error\": \"Python script returned no output.\"}" : result;

        } catch (Exception e) {
            e.printStackTrace();
            return "{\"error\": \"Failed to run scheduler: " + e.getMessage() + "\"}";
        }
    }
}
