<?php
session_start();

$DB_HOST = "localhost";
$DB_NAME = "Restaurantapp";
$DB_USER = "root";     // ou root
$DB_PASS = "root";   // vide si root par défaut
$CORS_ORIGIN = "http://localhost:5173";

header("Access-Control-Allow-Origin: $CORS_ORIGIN");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS");
if ($_SERVER['REQUEST_METHOD']==='OPTIONS') { http_response_code(204); exit; }
