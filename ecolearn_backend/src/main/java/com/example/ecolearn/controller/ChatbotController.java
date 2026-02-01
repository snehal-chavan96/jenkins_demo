package com.example.ecolearn.controller;

import com.example.ecolearn.dto.ChatRequest;
import com.example.ecolearn.dto.ChatResponse;
import com.example.ecolearn.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import reactor.core.publisher.Mono;

import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final RestTemplate restTemplate;

    public ChatbotController(RestTemplateBuilder builder) {
        this.restTemplate = builder.build();
    }

    @PostMapping("/ask")
    public ResponseEntity<?> askChatbot(@RequestBody Map<String, String> requestBody) {
        try {
            String question = requestBody.get("question");
            if (question == null || question.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Question is required"));
            }

            // Node.js microservice URL
            String nodeJsUrl = "http://localhost:5000/api/ask-chatbot";

            // Call Node.js service
            Map<String, String> nodeRequest = Map.of("question", question);
            ResponseEntity<Map> response = restTemplate.postForEntity(nodeJsUrl, nodeRequest, Map.class);

            return ResponseEntity.ok(response.getBody());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("answer", "Oops! Something went wrong."));
        }
    }
}
