<?php
require_once "conexion.php";

header("Content-Type: application/json");

// Vaciar detalle
$mysqli->query("TRUNCATE TABLE pedidos_detalle");

// Vaciar pedidos
$mysqli->query("TRUNCATE TABLE pedidos");

echo json_encode(["ok" => true]);
