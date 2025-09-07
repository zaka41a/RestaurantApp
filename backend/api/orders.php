<?php
// backend/api/orders.php
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/auth_mw.php";
requireAuth();

header("Content-Type: application/json; charset=utf-8");

$method = $_SERVER['REQUEST_METHOD'];

if ($method === "POST") {
  $b = json_decode(file_get_contents("php://input"), true);
  $table_id = (int)($b['table_id'] ?? 0);
  $items    = $b['items'] ?? [];

  if (!$table_id || !is_array($items) || !count($items)) {
    http_response_code(400);
    echo json_encode(["error" => "Données invalides"]);
    exit;
  }

  // Détecter la structure de order_items (qty vs quantity, presence de unit_price)
  $cols = $pdo->query("SHOW COLUMNS FROM `order_items`")->fetchAll(PDO::FETCH_COLUMN);
  $hasQty        = in_array('qty', $cols, true);
  $hasQuantity   = in_array('quantity', $cols, true);
  $hasUnitPrice  = in_array('unit_price', $cols, true);

  if (!($hasQty || $hasQuantity)) {
    http_response_code(500);
    echo json_encode(["error"=>"La table order_items doit avoir la colonne qty ou quantity"]);
    exit;
  }

  if ($hasUnitPrice && $hasQty) {
    $insLine = $pdo->prepare("INSERT INTO order_items(order_id, menu_item_id, qty, unit_price) VALUES (?,?,?,?)");
  } elseif ($hasUnitPrice && $hasQuantity) {
    $insLine = $pdo->prepare("INSERT INTO order_items(order_id, menu_item_id, quantity, unit_price) VALUES (?,?,?,?)");
  } elseif ($hasQty) {
    $insLine = $pdo->prepare("INSERT INTO order_items(order_id, menu_item_id, qty) VALUES (?,?,?)");
  } else { // quantity sans unit_price
    $insLine = $pdo->prepare("INSERT INTO order_items(order_id, menu_item_id, quantity) VALUES (?,?,?)");
  }

  $priceStmt = $pdo->prepare("SELECT price FROM menu_items WHERE id=?");

  $pdo->beginTransaction();
  try {
    // 1) entête
    $stmt = $pdo->prepare("INSERT INTO orders(table_id, user_id, status, created_at) VALUES (?,?, 'open', NOW())");
    $stmt->execute([$table_id, $_SESSION['uid'] ?? null]);
    $order_id = (int)$pdo->lastInsertId();

    // 2) lignes
    foreach ($items as $it) {
      $menu_id = (int)($it['menu_id'] ?? 0);
      $qty     = max(1, (int)($it['qty'] ?? 1));
      if (!$menu_id) continue;

      $priceStmt->execute([$menu_id]);
      $row = $priceStmt->fetch();
      $unitPrice = $row ? (float)$row['price'] : 0.0;

      if ($hasUnitPrice) {
        if ($hasQty) $insLine->execute([$order_id, $menu_id, $qty, $unitPrice]);
        else         $insLine->execute([$order_id, $menu_id, $qty, $unitPrice]); // quantity
      } else {
        if ($hasQty) $insLine->execute([$order_id, $menu_id, $qty]);
        else         $insLine->execute([$order_id, $menu_id, $qty]); // quantity
      }
    }

    // 3) marquer la table comme occupée
    $pdo->prepare("UPDATE dining_tables SET status='occupied' WHERE id=?")->execute([$table_id]);

    $pdo->commit();
    echo json_encode(["ok"=>true, "order_id"=>$order_id]);
  } catch (Throwable $e) {
    $pdo->rollBack();
    http_response_code(500);
    echo json_encode(["error"=>"Création commande échouée: ".$e->getMessage()]);
  }
  exit;
}

http_response_code(405);
echo json_encode(["error"=>"Method not allowed"]);
