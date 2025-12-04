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

$q = $mysqli->prepare("UPDATE pedidos SET estado = 'listo' WHERE id_pedido = ?");
$q->bind_param("i", $idPedido);

if ($q->execute()) {
    echo json_encode(["ok" => true]);
} else {
    echo json_encode(["ok" => false, "error" => "No se pudo actualizar"]);
}
