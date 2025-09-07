<?php
require_once __DIR__."/db.php";
header("Content-Type: application/json; charset=UTF-8");
echo json_encode($pdo->query("SELECT id, name FROM categories ORDER BY id")->fetchAll());
