package com.zomato.restaurant.repository;

import com.zomato.restaurant.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    
    List<Restaurant> findByIsActiveTrue();
    
    List<Restaurant> findByCuisineContainingIgnoreCase(String cuisine);
    
    List<Restaurant> findByNameContainingIgnoreCase(String name);
    
    List<Restaurant> findByAddressContainingIgnoreCase(String address);
    
    @Query("SELECT r FROM Restaurant r WHERE r.rating >= :minRating AND r.isActive = true")
    List<Restaurant> findByRatingGreaterThanEqual(@Param("minRating") Double minRating);
    
    @Query("SELECT r FROM Restaurant r WHERE r.isActive = true AND " +
           "(LOWER(r.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.cuisine) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Restaurant> searchRestaurants(@Param("keyword") String keyword);
    
    Optional<Restaurant> findByIdAndIsActiveTrue(Long id);
}
