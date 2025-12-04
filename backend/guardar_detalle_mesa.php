<?php
require_once "conexion.php";

header("Content-Type: application/json");

// Leer JSON desde JavaScript
$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data["mesa"])) {
    echo json_encode(["ok" => false, "error" => "Petición inválida"]);
    exit;
}

$mesa = intval($data["mesa"]);
$items = $data["items"];

// 1. Obtener id_cuenta asociada a la mesa
$q = $mysqli->prepare("SELECT id_cuenta FROM cuentas WHERE id_mesa = ?");
$q->bind_param("i", $mesa);
$q->execute();
$res = $q->get_result();

if ($res->num_rows == 0) {
    echo json_encode(["ok" => false, "error" => "Cuenta no encontrada"]);
    exit;
}

$row = $res->fetch_assoc();
$idCuenta = $row["id_cuenta"];

// 2. Eliminar detalle anterior
$del = $mysqli->prepare("DELETE FROM cuenta_detalle WHERE id_cuenta = ?");
$del->bind_param("i", $idCuenta);
$del->execute();

// 3. Insertar nuevos productos
$ins = $mysqli->prepare("
    INSERT INTO cuenta_detalle (id_cuenta, id_producto, cantidad, subtotal)
    VALUES (?, ?, ?, ?)
");

foreach ($items as $item) {

    $idProducto = intval($item["id_producto"]);
    $cantidad = intval($item["cantidad"]);
    $precio = floatval($item["precio"]);
    $subtotal = $precio * $cantidad;

    $ins->bind_param("iiid", $idCuenta, $idProducto, $cantidad, $subtotal);
    $ins->execute();
}

// 4. Actualizar total de la cuenta
$upd = $mysqli->prepare("
    UPDATE cuentas
    SET total = (
        SELECT IFNULL(SUM(subtotal), 0)
        FROM cuenta_detalle
        WHERE id_cuenta = ?
    )
    WHERE id_cuenta = ?
");

$upd->bind_param("ii", $idCuenta, $idCuenta);
$upd->execute();

// 5. Si existe un pedido activo para esta mesa, actualizarlo también

$pedido = $mysqli->prepare("SELECT id_pedido FROM pedidos WHERE id_mesa = ? ORDER BY id_pedido DESC LIMIT 1");
$pedido->bind_param("i", $mesa);
$pedido->execute();
$rPedido = $pedido->get_result();

if ($rPedido->num_rows > 0) {

    $rowP = $rPedido->fetch_assoc();
    $idPedido = $rowP["id_pedido"];

    // Eliminar detalle previo del pedido
    $delP = $mysqli->prepare("DELETE FROM pedidos_detalle WHERE id_pedido = ?");
    $delP->bind_param("i", $idPedido);
    $delP->execute();

    // Insertar nuevo detalle del pedido según la actualización
    $insP = $mysqli->prepare("
        INSERT INTO pedidos_detalle (id_pedido, id_producto, cantidad, subtotal)
        VALUES (?,?,?,?)
    ");

    foreach ($items as $item) {

        $idProd = intval($item["id_producto"]);
        $cant = intval($item["cantidad"]);
        $precio = floatval($item["precio"]);
        $subtotal = $precio * $cant;

        $insP->bind_param("iiid", $idPedido, $idProd, $cant, $subtotal);
        $insP->execute();
    }

    // Actualizar total del pedido
    $updP = $mysqli->prepare("
        UPDATE pedidos
        SET total = (SELECT SUM(subtotal) FROM pedidos_detalle WHERE id_pedido = ?)
        WHERE id_pedido = ?
    ");
    $updP->bind_param("ii", $idPedido, $idPedido);
    $updP->execute();
    $updP2 = $mysqli->prepare("UPDATE pedidos SET updated_at = NOW() WHERE id_pedido = ?");
    $updP2->bind_param("i", $idPedido);
    $updP2->execute();

}

// --- ACTUALIZAR PEDIDO EN COCINA SI YA EXISTE ---
$qPedido = $mysqli->prepare("SELECT id_pedido FROM pedidos WHERE id_mesa = ?");
$qPedido->bind_param("i", $mesa);
$qPedido->execute();
$resPedido = $qPedido->get_result();

if ($resPedido->num_rows > 0) {
    $rowPed = $resPedido->fetch_assoc();
    $idPedido = $rowPed["id_pedido"];

    // Borrar detalle viejo
    $delP = $mysqli->prepare("DELETE FROM pedidos_detalle WHERE id_pedido = ?");
    $delP->bind_param("i", $idPedido);
    $delP->execute();

    // Insertar nuevo detalle
    $insP = $mysqli->prepare("
        INSERT INTO pedidos_detalle (id_pedido, id_producto, cantidad, subtotal)
        VALUES (?,?,?,?)
    ");

    foreach ($items as $item) {
        $idProducto = intval($item["id_producto"]);
        $cantidad = intval($item["cantidad"]);
        $precio = floatval($item["precio"]);
        $subtotal = $precio * $cantidad;

        $insP->bind_param("iiid", $idPedido, $idProducto, $cantidad, $subtotal);
        $insP->execute();
    }

    // Actualizar total del pedido
    $mysqli->query("
        UPDATE pedidos
        SET total = (SELECT SUM(subtotal) FROM pedidos_detalle WHERE id_pedido = $idPedido),
            updated_at = NOW()
        WHERE id_pedido = $idPedido
    ");
}

// 5. Respuesta final
echo json_encode(["ok" => true]);
