<?php
require_once 'database.php';

try {
    $sql = file_get_contents(__DIR__ . '/database.sql');
    
    $pdo->exec($sql);
    
    echo "База данных успешно инициализирована!";
} catch(PDOException $e) {
    die("Ошибка инициализации базы данных: " . $e->getMessage());
}
?> 