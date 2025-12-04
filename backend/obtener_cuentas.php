<?php
require_once "conexion.php";

header("Content-Type: application/json");

// 1. Obtener todas las cuentas
$sql = "
    SELECT id_cuenta, id_mesa, fecha, total, estado
    FROM cuentas
    ORDER BY id_cuenta DESC
";
$res = $mysqli->query($sql);

$cuentas = [];

while ($row = $res->fetch_assoc()) {
    $row["total"] = intval($row["total"]);
    $idCuenta = $row["id_cuenta"];

    // 2. Obtener detalle de cada cuenta
    $sqlDetalle = "
        SELECT p.nombre, d.cantidad, (p.precio * d.cantidad) AS subtotal
        FROM cuenta_detalle d
        JOIN productos p ON p.id_producto = d.id_producto
        WHERE d.id_cuenta = $idCuenta
    ";

    $resDet = $mysqli->query($sqlDetalle);

    $detalle = [];
    while ($d = $resDet->fetch_assoc()) {
        $detalle[] = $d;
    }

    $row["detalle"] = $detalle;

    $cuentas[] = $row;
}

echo json_encode($cuentas);
