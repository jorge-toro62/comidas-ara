<?php
require_once "conexion.php";
header("Content-Type: application/json");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!isset($data["id_pedido"])) {
    echo json_encode(["ok" => false, "error" => "ID no recibido"]);
    exit;
}

$idPedido = intval($data["id_pedido"]);

// 1. Obtener los datos del pedido
$q = $mysqli->prepare("SELECT id_pedido, id_mesa, fecha, total FROM pedidos WHERE id_pedido = ?");
$q->bind_param("i", $idPedido);
$q->execute();
$res = $q->get_result();

if ($res->num_rows == 0) {
    echo json_encode(["ok" => false, "error" => "Pedido no encontrado"]);
    exit;
}

$pedido = $res->fetch_assoc();

// 2. Obtener detalles del pedido
$qDet = $mysqli->prepare("
    SELECT p.nombre, d.cantidad, d.subtotal 
    FROM pedidos_detalle d
    JOIN productos p ON p.id_producto = d.id_producto
    WHERE d.id_pedido = ?
");
$qDet->bind_param("i", $idPedido);
$qDet->execute();
$detalleRes = $qDet->get_result();

$detalle = [];
while ($d = $detalleRes->fetch_assoc()) {
    $detalle[] = $d;
}

// Convertimos el detalle a JSON
$detalleJSON = json_encode($detalle, JSON_UNESCAPED_UNICODE);

// 3. Guardar en el historial
$insert = $mysqli->prepare("
    INSERT INTO pedidos_historial (id_pedido, id_mesa, fecha_pedido, fecha_listo, total, detalle)
    VALUES (?, ?, ?, NOW(), ?, ?)
");

$insert->bind_param(
    "issds",
    $pedido["id_pedido"],
    $pedido["id_mesa"],
    $pedido["fecha"],
    $pedido["total"],
    $detalleJSON
);

$insert->execute();

// 4. Actualizar pedido a listo
$upd = $mysqli->prepare("UPDATE pedidos SET estado = 'listo' WHERE id_pedido = ?");
$upd->bind_param("i", $idPedido);
$upd->execute();

echo json_encode(["ok" => true]);
