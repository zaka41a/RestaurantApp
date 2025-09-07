<?php
require_once __DIR__."/../db.php";
if (!isset($_SESSION['uid'])) { http_response_code(401); echo json_encode(["auth"=>false]); exit; }
echo json_encode(["auth"=>true, "id"=>$_SESSION['uid'], "role_id"=>$_SESSION['role_id'], "name"=>$_SESSION['name']]);
