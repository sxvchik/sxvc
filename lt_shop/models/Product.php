<?php
require_once 'BaseModel.php';

class Product extends BaseModel {
    protected $table = 'products';

    public function getNewProducts() {
        $sql = "SELECT * FROM {$this->table} WHERE is_new = 1";
        $result = $this->conn->query($sql);
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getByBrand($brandId) {
        $sql = "SELECT * FROM {$this->table} WHERE brand_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $brandId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getByCategory($categoryId) {
        $sql = "SELECT * FROM {$this->table} WHERE category_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $categoryId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function search($query) {
        $search = "%$query%";
        $sql = "SELECT * FROM {$this->table} WHERE name LIKE ? OR description LIKE ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $search, $search);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }
}
?> 