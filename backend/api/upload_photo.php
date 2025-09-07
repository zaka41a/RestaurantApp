<?php
require_once __DIR__."/db.php";
require_once __DIR__."/auth_mw.php";
requireAdmin(); // upload réservé admin
header("Content-Type: application/json; charset=UTF-8");

// limite simple 3 Mo
if (!isset($_FILES['file'])) { http_response_code(400); echo json_encode(["error"=>"Aucun fichier"]); exit; }
$f = $_FILES['file'];
if ($f['error'] !== UPLOAD_ERR_OK) { http_response_code(400); echo json_encode(["error"=>"Upload error ".$f['error']]); exit; }

$ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
$ok = in_array($ext, ["jpg","jpeg","png","webp","gif"]);
if (!$ok) { http_response_code(400); echo json_encode(["error"=>"Format non supporté"]); exit; }

$base = bin2hex(random_bytes(8)).".".$ext;
$dest = __DIR__."/../uploads/".$base;
if (!move_uploaded_file($f['tmp_name'], $dest)) { http_response_code(500); echo json_encode(["error"=>"move failed"]); exit; }

// URL publique
$public = "/RestaurantApp/backend/uploads/".$base;
echo json_encode(["ok"=>true, "url"=>$public]);
