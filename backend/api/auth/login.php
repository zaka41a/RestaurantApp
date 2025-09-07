<?php
require_once __DIR__."/../db.php";   // démarre la session via config.php

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$plain = $data['password'] ?? '';

if ($email === '' || $plain === '') {
  http_response_code(400);
  echo json_encode(["success"=>false,"message"=>"Email & password required"]);
  exit;
}

$stmt = $pdo->prepare("SELECT id, role_id, full_name, email, password_hash FROM users WHERE email=?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
  http_response_code(401);
  echo json_encode(["success"=>false,"message"=>"Invalid credentials"]);
  exit;
}

$stored = $user['password_hash'];
$ok = false;

/* 1) Si c'est un hash moderne (bcrypt/argon), on vérifie normalement */
if (preg_match('/^\$2y\$|\$2a\$|\$2b\$|\$argon2id\$|\$argon2i\$/', $stored)) {
  $ok = password_verify($plain, $stored);

/* 2) Sinon, compatibilité MD5 (32 hex) */
} elseif (preg_match('/^[a-f0-9]{32}$/i', $stored)) {
  $ok = (strtolower($stored) === md5($plain));
  // Upgrade transparent vers bcrypt si le MD5 est bon
  if ($ok) {
    $new = password_hash($plain, PASSWORD_DEFAULT);
    $u = $pdo->prepare("UPDATE users SET password_hash=? WHERE id=?");
    $u->execute([$new, $user['id']]);
    $stored = $new;
  }
}

if (!$ok) {
  http_response_code(401);
  echo json_encode(["success"=>false,"message"=>"Invalid credentials"]);
  exit;
}

/* OK: on crée la session */
$_SESSION['uid']     = $user['id'];
$_SESSION['role_id'] = $user['role_id'];
$_SESSION['name']    = $user['full_name'];

echo json_encode([
  "success"=>true,
  "id"=>$user['id'],
  "name"=>$user['full_name'],
  "role_id"=>$user['role_id'],
  "email"=>$user['email']
]);
