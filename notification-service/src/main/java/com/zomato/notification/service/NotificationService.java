package com.zomato.notification.service;

import com.zomato.notification.event.OrderEvent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);
    
    private final LiveNotificationService liveNotificationService;

    @Autowired
    public NotificationService(LiveNotificationService liveNotificationService) {
        this.liveNotificationService = liveNotificationService;
    }

    @KafkaListener(topics = "order-events", groupId = "notification-service")
    public void handleOrderEvent(OrderEvent orderEvent) {
        logger.info("Received order event: {}", orderEvent);
        
        switch (orderEvent.getEventType()) {
            case "ORDER_CREATED":
                sendOrderConfirmationNotification(orderEvent);
                break;
            case "ORDER_CONFIRMED":
                sendOrderConfirmedNotification(orderEvent);
                break;
            case "ORDER_OUT_FOR_DELIVERY":
                sendDeliveryNotification(orderEvent);
                break;
            case "ORDER_DELIVERED":
                sendDeliveryConfirmedNotification(orderEvent);
                break;
            case "ORDER_CANCELLED":
                sendOrderCancelledNotification(orderEvent);
                break;
            default:
                logger.info("Unknown order event type: {}", orderEvent.getEventType());
        }
    }

    private void sendOrderConfirmationNotification(OrderEvent orderEvent) {
        logger.info("Sending order confirmation notification for order: {} to user: {}", 
                   orderEvent.getOrderId(), orderEvent.getUserId());
        
        String title = "Order Placed Successfully! 🎉";
        String message = String.format(
            "Hi! Your order #%d has been placed successfully. Total amount: $%.2f. We'll notify you once it's confirmed!",
            orderEvent.getOrderId(), orderEvent.getTotalAmount()
        );
        
        // Send live notification via WebSocket
        liveNotificationService.sendToUser(orderEvent.getUserId(), title, message, "ORDER_CREATED", orderEvent);
        
        // Send delivery tracking update
        String trackingMessage = String.format("Order #%d placed successfully. Restaurant is preparing your order.", orderEvent.getOrderId());
        liveNotificationService.sendDeliveryUpdate(orderEvent.getUserId(), orderEvent, trackingMessage);
        
        // Simulate traditional notification (email/SMS)
        simulateNotification(orderEvent.getUserId(), title, message);
    }

    private void sendOrderConfirmedNotification(OrderEvent orderEvent) {
        logger.info("Sending order confirmed notification for order: {} to user: {}", 
                   orderEvent.getOrderId(), orderEvent.getUserId());
        
        String title = "Order Confirmed! 👨‍🍳";
        String message = String.format(
            "Great news! Your order #%d has been confirmed and is being prepared. Estimated delivery time: 30-45 minutes.",
            orderEvent.getOrderId()
        );
        
        // Send live notification
        liveNotificationService.sendToUser(orderEvent.getUserId(), title, message, "ORDER_CONFIRMED", orderEvent);
        
        // Send delivery tracking update
        String trackingMessage = String.format("Order #%d confirmed! The restaurant is now preparing your delicious meal.", orderEvent.getOrderId());
        liveNotificationService.sendDeliveryUpdate(orderEvent.getUserId(), orderEvent, trackingMessage);
        
        simulateNotification(orderEvent.getUserId(), title, message);
    }

    private void sendDeliveryNotification(OrderEvent orderEvent) {
        logger.info("Sending delivery notification for order: {} to user: {}", 
                   orderEvent.getOrderId(), orderEvent.getUserId());
        
        String title = "Out for Delivery! 🚚";
        String message = String.format(
            "Your order #%d is out for delivery! Your food will arrive soon at %s",
            orderEvent.getOrderId(), orderEvent.getDeliveryAddress()
        );
        
        // Send live notification with high priority for delivery updates
        liveNotificationService.sendToUser(orderEvent.getUserId(), title, message, "ORDER_OUT_FOR_DELIVERY", orderEvent);
        
        // Send real-time delivery tracking update
        String trackingMessage = String.format("🚚 Your order is on the way! Delivery person has picked up order #%d and is heading to %s", 
                                             orderEvent.getOrderId(), orderEvent.getDeliveryAddress());
        liveNotificationService.sendDeliveryUpdate(orderEvent.getUserId(), orderEvent, trackingMessage);
        
        simulateNotification(orderEvent.getUserId(), title, message);
    }

    private void sendDeliveryConfirmedNotification(OrderEvent orderEvent) {
        logger.info("Sending delivery confirmed notification for order: {} to user: {}", 
                   orderEvent.getOrderId(), orderEvent.getUserId());
        
        String title = "Order Delivered! 🎉🍕";
        String message = String.format(
            "Your order #%d has been delivered! Thank you for choosing Zomato. Enjoy your meal!",
            orderEvent.getOrderId()
        );
        
        // Send live delivery confirmation
        liveNotificationService.sendToUser(orderEvent.getUserId(), title, message, "ORDER_DELIVERED", orderEvent);
        
        // Send final delivery tracking update
        String trackingMessage = String.format("✅ Order #%d delivered successfully! Hope you enjoy your meal. Please rate your experience!", orderEvent.getOrderId());
        liveNotificationService.sendDeliveryUpdate(orderEvent.getUserId(), orderEvent, trackingMessage);
        
        simulateNotification(orderEvent.getUserId(), title, message);
    }

    private void sendOrderCancelledNotification(OrderEvent orderEvent) {
        logger.info("Sending order cancelled notification for order: {} to user: {}", 
                   orderEvent.getOrderId(), orderEvent.getUserId());
        
        String message = String.format(
            "Unfortunately, your order #%d has been cancelled. If you were charged, the refund will be processed within 3-5 business days.",
            orderEvent.getOrderId()
        );
        
        simulateNotification(orderEvent.getUserId(), "Order Cancelled", message);
    }

    private void simulateNotification(Long userId, String subject, String message) {
        // In a real application, you would integrate with:
        // - Email service (SendGrid, AWS SES, etc.)
        // - SMS service (Twilio, AWS SNS, etc.)
        // - Push notification service (Firebase, OneSignal, etc.)
        
        logger.info("=== NOTIFICATION SENT ===");
        logger.info("To User ID: {}", userId);
        logger.info("Subject: {}", subject);
        logger.info("Message: {}", message);
        logger.info("========================");
        
        // Simulate processing time
        try {
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
