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

// 5. Respuesta final
echo json_encode(["ok" => true]);
