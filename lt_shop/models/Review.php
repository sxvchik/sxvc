<?php
require_once 'BaseModel.php';

class Review extends BaseModel {
    protected $table = 'reviews';

    public function getProductReviews($productId) {
        $sql = "SELECT r.*, u.username 
                FROM {$this->table} r 
                JOIN users u ON r.user_id = u.id 
                WHERE r.product_id = ? 
                ORDER BY r.created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getUserReviews($userId) {
        $sql = "SELECT r.*, p.name as product_name 
                FROM {$this->table} r 
                JOIN products p ON r.product_id = p.id 
                WHERE r.user_id = ? 
                ORDER BY r.created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getAverageRating($productId) {
        $sql = "SELECT AVG(rating) as average_rating 
                FROM {$this->table} 
                WHERE product_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return round($row['average_rating'], 1) ?? 0;
    }

    public function createReview($userId, $productId, $rating, $comment) {
        return $this->create([
            'user_id' => $userId,
            'product_id' => $productId,
            'rating' => $rating,
            'comment' => $comment
        ]);
    }
}
?> 