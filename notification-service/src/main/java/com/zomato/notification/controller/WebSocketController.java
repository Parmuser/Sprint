package com.zomato.notification.controller;

import com.zomato.notification.service.LiveNotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@Controller
public class WebSocketController {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    private final LiveNotificationService liveNotificationService;

    @Autowired
    public WebSocketController(LiveNotificationService liveNotificationService) {
        this.liveNotificationService = liveNotificationService;
    }

    /**
     * Handle user subscription to notifications
     */
    @MessageMapping("/subscribe")
    @SendTo("/topic/status")
    public Map<String, Object> subscribeToNotifications(Map<String, Object> message, 
                                                        SimpMessageHeaderAccessor headerAccessor) {
        String userId = (String) message.get("userId");
        String sessionId = headerAccessor.getSessionId();
        
        logger.info("User {} subscribed to live notifications with session {}", userId, sessionId);
        
        // Store user session mapping (in production, use Redis or database)
        Map<String, Object> response = new HashMap<>();
        response.put("status", "subscribed");
        response.put("userId", userId);
        response.put("message", "Successfully subscribed to live notifications");
        
        return response;
    }

    /**
     * Handle delivery tracking subscription
     */
    @MessageMapping("/track-order")
    public void trackOrder(Map<String, Object> message, SimpMessageHeaderAccessor headerAccessor) {
        String userId = (String) message.get("userId");
        String orderId = (String) message.get("orderId");
        String sessionId = headerAccessor.getSessionId();
        
        logger.info("User {} started tracking order {} with session {}", userId, orderId, sessionId);
        
        // In production, you might want to validate the user owns this order
        // and send current order status immediately
    }

    /**
     * Handle user connection events
     */
    @MessageMapping("/connect")
    public void handleConnect(Map<String, Object> message, SimpMessageHeaderAccessor headerAccessor) {
        String userId = (String) message.get("userId");
        String sessionId = headerAccessor.getSessionId();
        
        logger.info("User {} connected via WebSocket with session {}", userId, sessionId);
        
        // Send welcome message or current notifications
        Map<String, Object> welcome = new HashMap<>();
        welcome.put("type", "WELCOME");
        welcome.put("message", "Connected to live notifications");
        welcome.put("timestamp", java.time.LocalDateTime.now().toString());
    }
}
