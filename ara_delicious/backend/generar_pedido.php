<?php
require_once "conexion.php";

header("Content-Type: application/json");

// Leer JSON recibido
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data["mesa"]) || !isset($data["items"])) {
    echo json_encode(["ok" => false, "error" => "Datos inválidos"]);
    exit;
}

$mesa  = intval($data["mesa"]);
$items = $data["items"];

// 1. Insertar pedido
$q = $mysqli->prepare("INSERT INTO pedidos (id_mesa, total) VALUES (?, 0)");
$q->bind_param("i", $mesa);

if (!$q->execute()) {
    echo json_encode(["ok" => false, "error" => "Error insertando pedido"]);
    exit;
}

$idPedido = $mysqli->insert_id;

// 2. Insertar cada producto
$ins = $mysqli->prepare("
    INSERT INTO pedidos_detalle (id_pedido, id_producto, cantidad, subtotal)
    VALUES (?,?,?,?)
");

$total = 0;

foreach ($items as $item) {

    $id_producto = intval($item["id_producto"]);
    $cantidad    = intval($item["cantidad"]);
    $precio      = floatval($item["precio"]);

    $subtotal = $precio * $cantidad;
    $total   += $subtotal;

    $ins->bind_param("iiii", $idPedido, $id_producto, $cantidad, $subtotal);
    $ins->execute();
}

// 3. Actualizar total del pedido
$upd = $mysqli->prepare("UPDATE pedidos SET total = ? WHERE id_pedido = ?");
$upd->bind_param("ii", $total, $idPedido);
$upd->execute();

// 4. Respuesta final
echo json_encode(["ok" => true, "id_pedido" => $idPedido]);
