<?php
require_once __DIR__."/db.php";

header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "POST") {
  $data = json_decode(file_get_contents("php://input"), true);
  $name = trim($data['name'] ?? '');
  $phone = trim($data['phone'] ?? '');
  $date = trim($data['date'] ?? '');
  $people = max(1, intval($data['people'] ?? 1));

  if (!$name || !$date) { http_response_code(400); echo json_encode(["error"=>"name/date requis"]); exit; }

  $stmt = $pdo->prepare("INSERT INTO reservations (name, phone, date, people, status, created_at)
                         VALUES (?,?,?,?, 'pending', NOW())");
  $stmt->execute([$name,$phone,$date,$people]);
  echo json_encode(["ok"=>true, "id"=>$pdo->lastInsertId()]);
  exit;
}

if ($method === "GET") {
  $stmt = $pdo->query("SELECT * FROM reservations ORDER BY date DESC, id DESC");
  echo json_encode($stmt->fetchAll());
  exit;
}

http_response_code(405);
echo json_encode(["error"=>"Method not allowed"]);
