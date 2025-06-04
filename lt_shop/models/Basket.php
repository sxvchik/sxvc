<?php
require_once 'BaseModel.php';

class Basket extends BaseModel {
    protected $table = 'basket';

    public function getUserBasket($userId) {
        $sql = "SELECT b.*, p.name, p.price, p.description 
                FROM {$this->table} b 
                JOIN products p ON b.product_id = p.id 
                WHERE b.user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function addToBasket($userId, $productId, $quantity = 1) {
        $sql = "SELECT * FROM {$this->table} WHERE user_id = ? AND product_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $userId, $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows > 0) {
            $item = $result->fetch_assoc();
            $newQuantity = $item['quantity'] + $quantity;
            return $this->update($item['id'], ['quantity' => $newQuantity]);
        } else {
            return $this->create([
                'user_id' => $userId,
                'product_id' => $productId,
                'quantity' => $quantity
            ]);
        }
    }

    public function updateQuantity($basketId, $quantity) {
        return $this->update($basketId, ['quantity' => $quantity]);
    }

    public function getBasketTotal($userId) {
        $sql = "SELECT SUM(b.quantity * p.price) as total 
                FROM {$this->table} b 
                JOIN products p ON b.product_id = p.id 
                WHERE b.user_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $row = $result->fetch_assoc();
        return $row['total'] ?? 0;
    }
}
?> 