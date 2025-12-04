<?php
require_once "conexion.php";

header("Content-Type: application/json");

$mesa = intval($_GET["mesa"]);

// 1. Verificar que la mesa existe
$checkMesa = $mysqli->prepare("SELECT id_mesa FROM mesas WHERE id_mesa = ?");
$checkMesa->bind_param("i", $mesa);
$checkMesa->execute();
$resMesa = $checkMesa->get_result();

if ($resMesa->num_rows == 0) {
    echo json_encode(["error" => "Mesa no existe"]);
    exit;
}

// 2. Verificar si ya existe una cuenta para esa mesa
$qCuenta = $mysqli->prepare("SELECT id_cuenta, total FROM cuentas WHERE id_mesa = ?");
$qCuenta->bind_param("i", $mesa);
$qCuenta->execute();
$resCuenta = $qCuenta->get_result();

if ($resCuenta->num_rows == 0) {

    // Crear la cuenta si no existe
    $crear = $mysqli->prepare("INSERT INTO cuentas (id_mesa, total, estado, fecha) VALUES (?, 0, 'abierta', NOW())");
    $crear->bind_param("i", $mesa);
    $crear->execute();

    $idCuenta = $crear->insert_id;

} else {
    $row = $resCuenta->fetch_assoc();
    $idCuenta = $row["id_cuenta"];
}

// 3. Obtener los productos desde cuenta_detalle (TU NOMBRE REAL)
$qDetalle = $mysqli->prepare("
    SELECT 
        d.id_producto,
        p.nombre,
        p.precio,
        d.cantidad,
        (p.precio * d.cantidad) AS subtotal
    FROM cuenta_detalle d
    INNER JOIN productos p ON p.id_producto = d.id_producto
    WHERE d.id_cuenta = ?
");
$qDetalle->bind_param("i", $idCuenta);
$qDetalle->execute();
$detalle = $qDetalle->get_result()->fetch_all(MYSQLI_ASSOC);

// 4. Calcular total real
$total = array_sum(array_column($detalle, "subtotal"));

// 5. Respuesta en JSON
echo json_encode([
    "id_mesa" => $mesa,
    "id_cuenta" => $idCuenta,
    "total" => $total,
    "detalle" => $detalle
]);
