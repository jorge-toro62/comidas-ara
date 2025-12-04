<?php
// backend/conexion.php
$host = "localhost";
$user = "root";      // por defecto en XAMPP
$pass = "";          // por defecto en XAMPP
$db   = "comidas_db";

$mysqli = new mysqli($host, $user, $pass, $db);

if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión: " . $mysqli->connect_error]);
    exit;
}

$mysqli->set_charset("utf8mb4");
?>
