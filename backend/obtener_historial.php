<?php
require_once "conexion.php";

header("Content-Type: application/json");

// Obtener TODAS las cuentas registradas
$q = $mysqli->query("
    SELECT 
        c.id_cuenta,
        c.id_mesa,
        c.fecha,
        c.estado,
        c.total
    FROM cuentas c
    ORDER BY c.fecha DESC
");

$historial = [];

while ($row = $q->fetch_assoc()) {

    $idCuenta = $row["id_cuenta"];

    // Obtener detalle por cuenta
    $detQ = $mysqli->query("
        SELECT 
            p.nombre,
            p.precio,
            d.cantidad,
            d.subtotal
        FROM cuenta_detalle d
        JOIN productos p ON p.id_producto = d.id_producto
        WHERE d.id_cuenta = $idCuenta
    ");

    $detalle = [];
    while ($d = $detQ->fetch_assoc()) {
        $detalle[] = $d;
    }

    $row["detalle"] = $detalle;
    $historial[] = $row;
}

echo json_encode($historial, JSON_UNESCAPED_UNICODE);
