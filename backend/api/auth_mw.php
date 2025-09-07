<?php
require_once __DIR__."/db.php";

function requireAuth() {
  if (!isset($_SESSION['uid'])) {
    http_response_code(401);
    echo json_encode(["error"=>"Unauthorized"]);
    exit;
  }
}

function requireAdmin() {
  requireAuth();
  if (($_SESSION['role_id'] ?? 0) != 1) {
    http_response_code(403);
    echo json_encode(["error"=>"Forbidden"]);
    exit;
  }
}
