<?php
require_once 'BaseModel.php';

class Article extends BaseModel {
    protected $table = 'articles';

    public function getLatestArticles($limit = 10) {
        $sql = "SELECT a.*, u.username as author_name 
                FROM {$this->table} a 
                JOIN users u ON a.author_id = u.id 
                ORDER BY a.created_at DESC 
                LIMIT ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $limit);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function getArticlesByAuthor($authorId) {
        $sql = "SELECT * FROM {$this->table} WHERE author_id = ? ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $authorId);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function searchArticles($query) {
        $search = "%$query%";
        $sql = "SELECT a.*, u.username as author_name 
                FROM {$this->table} a 
                JOIN users u ON a.author_id = u.id 
                WHERE a.title LIKE ? OR a.content LIKE ? 
                ORDER BY a.created_at DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $search, $search);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function createArticle($title, $content, $authorId) {
        return $this->create([
            'title' => $title,
            'content' => $content,
            'author_id' => $authorId
        ]);
    }
}
?> 