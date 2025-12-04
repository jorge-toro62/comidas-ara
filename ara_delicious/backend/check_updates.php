<?php
require_once "conexion.php";

header("Content-Type: application/json");

// Buscar el último pedido modificado
$q = $mysqli->query("SELECT MAX(updated_at) AS last_update FROM pedidos");
$data = $q->fetch_assoc();

echo json_encode([
    "last_update" => $data["last_update"]
]);
