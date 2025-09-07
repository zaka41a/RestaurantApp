<?php
// backend/api/tables.php
require_once __DIR__ . "/db.php";        // ✅ chemin corrigé
require_once __DIR__ . "/auth_mw.php";   // ✅ chemin corrigé
requireAuth();

header("Content-Type: application/json; charset=utf-8");
$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
  $stmt = $pdo->query("SELECT id, number, seats, status FROM dining_tables ORDER BY number");
  echo json_encode($stmt->fetchAll());
  exit;
}

if ($method === "PATCH") {
  $id = (int)($_GET['id'] ?? 0);
  if (!$id) { http_response_code(400); echo json_encode(["error"=>"id manquant"]); exit; }

  $data   = json_decode(file_get_contents("php://input"), true);
  $status = $data['status'] ?? 'free';

  $stmt = $pdo->prepare("UPDATE dining_tables SET status=? WHERE id=?");
  $stmt->execute([$status, $id]);

  echo json_encode(["ok" => true]);
  exit;
}

http_response_code(405);
echo json_encode(["error"=>"Method not allowed"]);
