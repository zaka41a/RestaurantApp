<?php
require_once __DIR__."/../db.php";
require_once __DIR__."/../auth_mw.php"; // contient requireAdmin()
requireAdmin();

$body = json_decode(file_get_contents("php://input"), true);
$full_name = trim($body['full_name'] ?? '');
$email = trim($body['email'] ?? '');
$phone = trim($body['phone'] ?? '');
$password = $body['password'] ?? '';

if (!$full_name || !$email || !$password) { http_response_code(400); echo json_encode(["error"=>"full_name, email, password required"]); exit; }

$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("INSERT INTO users (role_id, full_name, email, phone, password_hash) VALUES (2,?,?,?,?)");
try {
  $stmt->execute([$full_name, $email, $phone, $hash]);
  echo json_encode(["id"=>$pdo->lastInsertId(), "full_name"=>$full_name, "email"=>$email, "role"=>"server"]);
} catch (Throwable $e) {
  http_response_code(409);
  echo json_encode(["error"=>"Email already exists"]);
}
