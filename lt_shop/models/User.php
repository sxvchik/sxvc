<?php
require_once 'BaseModel.php';

class User extends BaseModel {
    protected $table = 'users';

    public function register($name, $email, $password) {
        try {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            return $this->create([
                'name' => $name,
                'email' => $email,
                'password' => $hashedPassword
            ]);
        } catch (PDOException $e) {
            error_log("Error in register: " . $e->getMessage());
            return false;
        }
    }

    public function login($email, $password) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                unset($user['password']);
                return $user;
            }
            return false;
        } catch (PDOException $e) {
            error_log("Error in login: " . $e->getMessage());
            return false;
        }
    }

    public function updateProfile($userId, $data) {
        try {
            if (isset($data['password'])) {
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            }
            return $this->update($userId, $data);
        } catch (PDOException $e) {
            error_log("Error in updateProfile: " . $e->getMessage());
            return false;
        }
    }

    public function getUserByEmail($email) {
        try {
            $stmt = $this->pdo->prepare("SELECT * FROM {$this->table} WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($user) {
                unset($user['password']);
            }
            return $user;
        } catch (PDOException $e) {
            error_log("Error in getUserByEmail: " . $e->getMessage());
            return false;
        }
    }

    public function validatePassword($password) {
        return strlen($password) >= 8 && 
               preg_match('/[A-Za-z]/', $password) && 
               preg_match('/[0-9]/', $password);
    }

    public function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
}
?> 