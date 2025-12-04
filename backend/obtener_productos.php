<?php
// backend/obtener_productos.php
header("Content-Type: application/json; charset=utf-8");

require_once "conexion.php";

$sql = "SELECT id_producto, nombre, precio FROM productos ORDER BY nombre";
$res = $mysqli->query($sql);

$productos = [];

while ($row = $res->fetch_assoc()) {
    $productos[] = $row;
}

echo json_encode($productos);
