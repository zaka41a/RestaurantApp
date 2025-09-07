<?php
require_once __DIR__."/../db.php";
require_once __DIR__."/../auth_mw.php";
requireAdmin();

header("Content-Type: application/json; charset=utf-8");
$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
  $q = $pdo->query("SELECT id, full_name, email, phone, created_at FROM users WHERE role_id=2 ORDER BY id DESC");
  echo json_encode($q->fetchAll());
  exit;
}

if ($method === "POST") {
  $b = json_decode(file_get_contents("php://input"), true);
  $name  = trim($b['full_name'] ?? "");
  $email = trim($b['email'] ?? "");
  $phone = trim($b['phone'] ?? "");
  $pass  = $b['password'] ?? "server123";

  if(!$name || !$email) { http_response_code(400); echo json_encode(["error"=>"full_name et email requis"]); exit; }
  $hash = password_hash($pass, PASSWORD_DEFAULT);

  $stmt = $pdo->prepare("INSERT INTO users (role_id, full_name, email, phone, password_hash, created_at)
                         VALUES (2,?,?,?,?,NOW())");
  try { 
    $stmt->execute([$name,$email,$phone,$hash]); 
    echo json_encode(["ok"=>true]); 
  } catch(Throwable $e){ 
    http_response_code(409); echo json_encode(["error"=>"Email existe déjà"]); 
  }
  exit;
}

if ($method === "DELETE") {
  $id = intval($_GET['id'] ?? 0);
  if(!$id) { http_response_code(400); exit; }
  $pdo->prepare("DELETE FROM users WHERE id=? AND role_id=2")->execute([$id]);
  echo json_encode(["ok"=>true]); exit;
}

http_response_code(405);
echo json_encode(["error"=>"Method not allowed"]);
