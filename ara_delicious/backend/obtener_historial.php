<?php
require_once "conexion.php";
header("Content-Type: application/json");

$sql = "SELECT * FROM pedidos_historial ORDER BY id_historial DESC";
$res = $mysqli->query($sql);

$historial = [];

while ($row = $res->fetch_assoc()) {
    $row["detalle"] = json_decode($row["detalle"], true); // convertir JSON
    $historial[] = $row;
}

echo json_encode($historial, JSON_UNESCAPED_UNICODE);
