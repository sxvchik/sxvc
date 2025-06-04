<?php
require_once 'BaseModel.php';

class Stock extends BaseModel {
    protected $table = 'stocks';

    public function getActiveStocks() {
        $currentDate = date('Y-m-d');
        $sql = "SELECT * FROM {$this->table} 
                WHERE start_date <= ? AND end_date >= ? 
                ORDER BY end_date ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $currentDate, $currentDate);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getUpcomingStocks() {
        $currentDate = date('Y-m-d');
        $sql = "SELECT * FROM {$this->table} 
                WHERE start_date > ? 
                ORDER BY start_date ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $currentDate);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function createStock($title, $description, $startDate, $endDate, $discountPercent) {
        return $this->create([
            'title' => $title,
            'description' => $description,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'discount_percent' => $discountPercent
        ]);
    }

    public function updateStock($id, $data) {
        return $this->update($id, $data);
    }

    public function deleteExpiredStocks() {
        $currentDate = date('Y-m-d');
        $sql = "DELETE FROM {$this->table} WHERE end_date < ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $currentDate);
        return $stmt->execute();
    }
}
?> 