<?php
// backend/api/upload.php
require_once __DIR__."/auth_mw.php";
requireAuth(); // autorisé pour admin & serveur connectés

$targetDir = __DIR__."/../uploads/foods";
if (!is_dir($targetDir)) { @mkdir($targetDir, 0775, true); }

if (!isset($_FILES['file'])) {
  http_response_code(400);
  echo json_encode(["error"=>"Aucun fichier"]);
  exit;
}

$f = $_FILES['file'];
if ($f['error'] !== UPLOAD_ERR_OK) {
  http_response_code(400);
  echo json_encode(["error"=>"Upload error ".$f['error']]);
  exit;
}

$ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
$allowed = ["jpg","jpeg","png","webp","gif"];
if (!in_array($ext, $allowed)) {
  http_response_code(415);
  echo json_encode(["error"=>"Type non supporté"]);
  exit;
}

$basename = date("Ymd_His")."_".bin2hex(random_bytes(4)).".".$ext;
$destFs = $targetDir."/".$basename;
if (!move_uploaded_file($f['tmp_name'], $destFs)) {
  http_response_code(500);
  echo json_encode(["error"=>"move_uploaded_file failed"]);
  exit;
}

/* Chemin web depuis /RestaurantApp/backend/api/../../
   Ton frontend atteint les images via http://localhost/RestaurantApp/backend/uploads/foods/<file> */
$webPath = "http://localhost/RestaurantApp/backend/uploads/foods/".$basename;

header("Content-Type: application/json; charset=UTF-8");
echo json_encode(["url"=>$webPath]);
