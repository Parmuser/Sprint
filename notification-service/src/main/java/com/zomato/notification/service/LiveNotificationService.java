package com.zomato.notification.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.zomato.notification.event.OrderEvent;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class LiveNotificationService {

    private static final Logger logger = LoggerFactory.getLogger(LiveNotificationService.class);
    
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public LiveNotificationService(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Send live notification to specific user
     */
    public void sendToUser(Long userId, String title, String message, String eventType, OrderEvent orderEvent) {
        Map<String, Object> notification = createNotificationPayload(title, message, eventType, orderEvent);
        
        // Send to specific user's private queue
        String destination = "/queue/notifications";
        messagingTemplate.convertAndSendToUser(userId.toString(), destination, notification);
        
        logger.info("Live notification sent to user {} via WebSocket: {}", userId, title);
    }

    /**
     * Send live delivery tracking update to specific user
     */
    public void sendDeliveryUpdate(Long userId, OrderEvent orderEvent, String trackingMessage) {
        Map<String, Object> deliveryUpdate = new HashMap<>();
        deliveryUpdate.put("type", "DELIVERY_TRACKING");
        deliveryUpdate.put("orderId", orderEvent.getOrderId());
        deliveryUpdate.put("status", orderEvent.getStatus());
        deliveryUpdate.put("eventType", orderEvent.getEventType());
        deliveryUpdate.put("message", trackingMessage);
        deliveryUpdate.put("deliveryAddress", orderEvent.getDeliveryAddress());
        deliveryUpdate.put("estimatedTime", getEstimatedDeliveryTime(orderEvent.getEventType()));
        deliveryUpdate.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        // Send to user's delivery tracking channel
        String destination = "/queue/delivery-tracking";
        messagingTemplate.convertAndSendToUser(userId.toString(), destination, deliveryUpdate);
        
        logger.info("Live delivery tracking sent to user {}: {}", userId, trackingMessage);
    }

    /**
     * Broadcast general notifications to all connected users
     */
    public void broadcastToAll(String title, String message) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("title", title);
        notification.put("message", message);
        notification.put("type", "BROADCAST");
        notification.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));

        messagingTemplate.convertAndSend("/topic/announcements", notification);
        
        logger.info("Broadcast notification sent: {}", title);
    }

    private Map<String, Object> createNotificationPayload(String title, String message, String eventType, OrderEvent orderEvent) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("title", title);
        notification.put("message", message);
        notification.put("type", "ORDER_NOTIFICATION");
        notification.put("eventType", eventType);
        notification.put("orderId", orderEvent.getOrderId());
        notification.put("restaurantId", orderEvent.getRestaurantId());
        notification.put("totalAmount", orderEvent.getTotalAmount());
        notification.put("status", orderEvent.getStatus());
        notification.put("timestamp", LocalDateTime.now().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME));
        notification.put("priority", getPriority(eventType));
        
        return notification;
    }

    private String getEstimatedDeliveryTime(String eventType) {
        switch (eventType) {
            case "ORDER_CREATED":
                return "45-60 minutes";
            case "ORDER_CONFIRMED":
                return "30-45 minutes";
            case "ORDER_PREPARED":
                return "15-25 minutes";
            case "ORDER_OUT_FOR_DELIVERY":
                return "10-15 minutes";
            case "ORDER_DELIVERED":
                return "Delivered";
            default:
                return "Unknown";
        }
    }

    private String getPriority(String eventType) {
        switch (eventType) {
            case "ORDER_CANCELLED":
                return "HIGH";
            case "ORDER_OUT_FOR_DELIVERY":
            case "ORDER_DELIVERED":
                return "MEDIUM";
            default:
                return "LOW";
        }
    }
}
