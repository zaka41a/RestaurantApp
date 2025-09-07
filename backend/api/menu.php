<?php // backend/api/menu.php
require_once __DIR__."/db.php";
require_once __DIR__."/auth_mw.php";

header("Content-Type: application/json; charset=utf-8");

function ensureDir(string $path): void {
  if (is_dir($path)) {
    if (!is_writable($path)) {
      @chmod($path, 0777);
      if (!is_writable($path)) {
        http_response_code(500);
        echo json_encode(["error"=>"Dossier non inscriptible: ".$path]);
        exit;
      }
    }
    return;
  }
  @mkdir($path, 0777, true);
  if (!is_dir($path)) {
    http_response_code(500);
    echo json_encode(["error"=>"Impossible de créer le dossier: ".$path." (droits ?)"]);
    exit;
  }
  @chmod($path, 0777);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "GET") {
  $sql = "SELECT m.id, c.name AS category, m.name, m.price, m.image_path, m.description
          FROM menu_items m
          JOIN categories c ON c.id = m.category_id
          WHERE m.is_active = 1
          ORDER BY c.name, m.name";
  echo json_encode($pdo->query($sql)->fetchAll());
  exit;
}

if ($method === "POST") {
  requireAdmin();

  if (empty($_POST) && empty($_FILES) && !isset($_SERVER['HTTP_CONTENT_TYPE'])) {
    http_response_code(413);
    echo json_encode(["error"=>"Payload trop volumineux (augmente upload_max_filesize / post_max_size dans php.ini)"]);
    exit;
  }

  // multipart/form-data
  if (isset($_FILES['image']) || isset($_POST['name'])) {
    $category_id = (int)($_POST['category_id'] ?? 0);
    $name        = trim($_POST['name'] ?? "");
    $price       = is_numeric($_POST['price'] ?? null) ? (float)$_POST['price'] : 0;
    $desc        = trim($_POST['description'] ?? "");
    $imagePath   = trim($_POST['image_path'] ?? "");

    if (!$category_id || !$name) {
      http_response_code(400);
      echo json_encode(["error"=>"category_id et name requis"]);
      exit;
    }

    if (!empty($_FILES['image']) && $_FILES['image']['error'] !== UPLOAD_ERR_NO_FILE) {
      $f = $_FILES['image'];

      if ($f['error'] !== UPLOAD_ERR_OK) {
        $map = [
          UPLOAD_ERR_INI_SIZE=>"Fichier trop volumineux (upload_max_filesize)",
          UPLOAD_ERR_FORM_SIZE=>"Fichier trop volumineux (MAX_FILE_SIZE)",
          UPLOAD_ERR_PARTIAL=>"Upload partiel",
          UPLOAD_ERR_NO_FILE=>"Aucun fichier",
          UPLOAD_ERR_NO_TMP_DIR=>"Dossier tmp manquant",
          UPLOAD_ERR_CANT_WRITE=>"Échec d’écriture",
          UPLOAD_ERR_EXTENSION=>"Extension bloquée"
        ];
        http_response_code(400);
        echo json_encode(["error"=>"Upload error ".($map[$f['error']] ?? $f['error'])]);
        exit;
      }

      if ($f['size'] > 3*1024*1024) {
        http_response_code(413);
        echo json_encode(["error"=>"Fichier > 3 Mo"]);
        exit;
      }

      $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
      if (!in_array($ext, ["jpg","jpeg","png","webp","gif"], true)) {
        http_response_code(415);
        echo json_encode(["error"=>"Format non supporté"]);
        exit;
      }

      // chemins physiques basés sur backend/api/
      $backendRoot = realpath(__DIR__ . "/.."); // .../backend
      if ($backendRoot === false) $backendRoot = __DIR__ . "/..";
      $dirUploads  = $backendRoot . "/uploads";
      $dirFoods    = $dirUploads . "/foods";

      ensureDir($dirUploads);
      ensureDir($dirFoods);

      $fname   = uniqid("food_").".".$ext;
      $destAbs = $dirFoods . "/" . $fname;

      if (!@move_uploaded_file($f['tmp_name'], $destAbs)) {
        http_response_code(500);
        echo json_encode(["error"=>"move_uploaded_file a échoué vers: ".$destAbs]);
        exit;
      }

      // chemin relatif stocké en DB (le front préfixe avec http://localhost/RestaurantApp/backend/)
      $imagePath = "uploads/foods/".$fname;
    }

    $stmt = $pdo->prepare("INSERT INTO menu_items (category_id, name, description, price, image_path, is_active)
                           VALUES (?,?,?,?,?,1)");
    $stmt->execute([$category_id, $name, $desc, $price, $imagePath ?: null]);

    echo json_encode(["ok"=>true, "id"=>$pdo->lastInsertId(), "image_path"=>$imagePath]);
    exit;
  }

  // JSON (sans upload)
  $b = json_decode(file_get_contents("php://input"), true);
  if (!$b || !isset($b['category_id'], $b['name'], $b['price'])) {
    http_response_code(400);
    echo json_encode(["error"=>"JSON incomplet"]);
    exit;
  }

  $stmt = $pdo->prepare("INSERT INTO menu_items(category_id,name,description,price,image_path,is_active)
                         VALUES(?,?,?,?,?,1)");
  $stmt->execute([
    (int)$b['category_id'],
    trim($b['name']),
    trim($b['description'] ?? ""),
    (float)$b['price'],
    trim($b['image_path'] ?? '') ?: null
  ]);
  echo json_encode(["ok"=>true]);
  exit;
}

if ($method === "DELETE") {
  requireAdmin();
  $id = (int)($_GET['id'] ?? 0);
  if(!$id) { http_response_code(400); echo json_encode(["error"=>"id manquant"]); exit; }
  $pdo->prepare("DELETE FROM menu_items WHERE id=?")->execute([$id]);
  echo json_encode(["ok"=>true]);
  exit;
}

http_response_code(405);
echo json_encode(["error"=>"Method not allowed"]);
