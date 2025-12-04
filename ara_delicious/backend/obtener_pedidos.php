<?php
require_once "conexion.php";

header("Content-Type: application/json");

if ($mysqli->connect_errno) {
    echo json_encode(["error" => "Error de conexión"]);
    exit;
}

// Verificar tabla pedidos
$check = $mysqli->query("SHOW TABLES LIKE 'pedidos'");
if ($check->num_rows == 0) {
    echo json_encode(["error" => "La tabla 'pedidos' no existe"]);
    exit;
}

$sql = "SELECT id_pedido, id_mesa, fecha, total 
        FROM pedidos
        ORDER BY id_pedido DESC";

$res = $mysqli->query($sql);
$pedidos = [];

while ($row = $res->fetch_assoc()) {

    $idPedido = $row["id_pedido"];

    // Verificar tabla pedidos_detalle
    $check2 = $mysqli->query("SHOW TABLES LIKE 'pedidos_detalle'");
    if ($check2->num_rows == 0) {
        $row["detalle"] = [];
        $pedidos[] = $row;
        continue;
    }

    // CONSULTA CORRECTA
    $sqlDet = "
        SELECT 
            p.nombre,
            p.precio,
            d.cantidad,
            d.subtotal
        FROM pedidos_detalle d
        JOIN productos p ON p.id_producto = d.id_producto
        WHERE d.id_pedido = $idPedido
    ";

    $detalleRes = $mysqli->query($sqlDet);

    $detalle = [];
    while ($d = $detalleRes->fetch_assoc()) {
        $detalle[] = $d;
    }

    $row["detalle"] = $detalle;
    $pedidos[] = $row;
}

echo json_encode($pedidos, JSON_UNESCAPED_UNICODE);
