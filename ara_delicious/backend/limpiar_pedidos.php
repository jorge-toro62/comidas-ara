<?php
require_once "conexion.php";
header("Content-Type: application/json");

// ELIMINAR SOLO PEDIDOS LISTOS
$delDetalle = $mysqli->query("
    DELETE FROM pedidos_detalle 
    WHERE id_pedido IN (SELECT id_pedido FROM pedidos WHERE estado = 'listo')
");

$delPedidos = $mysqli->query("
    DELETE FROM pedidos 
    WHERE estado = 'listo'
");

echo json_encode(["ok" => true]);
