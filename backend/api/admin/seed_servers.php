<?php
require_once __DIR__ . "/../db.php";

header("Content-Type: application/json; charset=utf-8");

$servers = [
  ["full_name"=>"ahmad bidaoui", "email"=>"ahmad@example.com",  "phone"=>"0600000001"],
  ["full_name"=>"ismail sifari", "email"=>"ismail@example.com", "phone"=>"0600000002"],
  ["full_name"=>"simo darhani",  "email"=>"simo@example.com",   "phone"=>"0600000003"],
];

$pwd = password_hash("server123", PASSWORD_DEFAULT);

$sel = $pdo->prepare("SELECT id FROM users WHERE email=? LIMIT 1");
$ins = $pdo->prepare("INSERT INTO users (role_id, full_name, email, phone, password_hash, created_at)
                      VALUES (2,?,?,?,?,NOW())");

$count = 0;
foreach ($servers as $s) {
  $sel->execute([$s["email"]]);
  if (!$sel->fetch()) {
    $ins->execute([$s["full_name"], $s["email"], $s["phone"], $pwd]);
    $count++;
  }
}
echo json_encode(["inserted"=>$count, "note"=>"password=server123"]);
