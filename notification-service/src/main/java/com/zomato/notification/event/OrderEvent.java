package com.zomato.notification.event;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderEvent {
    
    private Long orderId;
    private Long userId;
    private Long restaurantId;
    private BigDecimal totalAmount;
    private String status;
    private String deliveryAddress;
    private LocalDateTime createdAt;
    private String eventType; // ORDER_CREATED, ORDER_CONFIRMED, ORDER_CANCELLED, etc.

    // Constructors
    public OrderEvent() {}

    public OrderEvent(Long orderId, Long userId, Long restaurantId, BigDecimal totalAmount, 
                     String status, String deliveryAddress, String eventType) {
        this.orderId = orderId;
        this.userId = userId;
        this.restaurantId = restaurantId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.deliveryAddress = deliveryAddress;
        this.eventType = eventType;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    @Override
    public String toString() {
        return "OrderEvent{" +
                "orderId=" + orderId +
                ", userId=" + userId +
                ", restaurantId=" + restaurantId +
                ", totalAmount=" + totalAmount +
                ", status='" + status + '\'' +
                ", eventType='" + eventType + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
