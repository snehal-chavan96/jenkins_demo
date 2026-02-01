package com.example.ecolearn.service;

import com.example.ecolearn.dto.ChatRequest;
import com.example.ecolearn.dto.ChatResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.Random;

@Service
public class ChatbotService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private static final List<String> FALLBACK_RESPONSES = List.of(
            "I'm here to help! Could you clarify what you're asking?",
            "That sounds interesting. Can you give me more details?",
            "Let's tackle this step by step. What part should we start with?",
            "Great question! Try asking for an example if needed.",
            "I’m still learning too, but let’s explore this together."
    );

    private final WebClient webClient;

    public ChatbotService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl("https://gemini.googleapis.com/v1").build();
    }

    public Mono<ChatResponse> askChatbot(ChatRequest request) {
        if (request.getQuestion() == null || request.getQuestion().isBlank()) {
            return Mono.just(new ChatResponse("Question is required."));
        }

        String systemPrompt = """
            You are EcoBuddy 🌍, a friendly, expert, and engaging tutor for students.
            Your main goal is to help users learn about computer science, programming, coding, and technology in a simple and fun way.
            Guidelines:
            - Keep answers beginner-friendly and clear.
            - Use numbered or bulleted lists when helpful.
            - Give concise explanations (3-5 sentences).
            - Include simple examples only if necessary.
            - Encourage students to ask follow-up questions for deeper understanding.
            - Avoid using Markdown formatting (**bold**, _italics_, etc.).
            - If the question is vague, ask a clarifying question politely.
            - Use a friendly, motivating tone to make learning fun.
            - Include small positive remarks (like 🌱, 🚀, or 👍) to engage students.
""";

        String finalPrompt = systemPrompt + "\nStudent question: " + request.getQuestion();


        return webClient.post()
                .uri("/models/gemini-2.5-flash:generateContent")
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(new GeminiRequest(finalPrompt))
                .retrieve()
                .bodyToMono(GeminiResponse.class)
                .map(response -> {
                    String answer = (response != null && response.candidates() != null && !response.candidates().isEmpty())
                            ? response.candidates().get(0).content().parts().get(0).text().trim()
                            : FALLBACK_RESPONSES.get(new Random().nextInt(FALLBACK_RESPONSES.size()));
                    return new ChatResponse(answer.replaceAll("\\s+", " ").trim());
                })

                .onErrorResume(e -> Mono.just(
                        new ChatResponse(FALLBACK_RESPONSES.get(new Random().nextInt(FALLBACK_RESPONSES.size())))
                ));
    }

    // Inner classes for Gemini API request/response
    record GeminiRequest(String contents) {}
    record GeminiResponse(List<Candidate> candidates) {
        record Candidate(Content content) {}
        record Content(List<Part> parts) {}
        record Part(String text) {}
    }
}
