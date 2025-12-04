<?php
require_once "conexion.php";
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

$inicio = $data["inicio"] ?? null;
$fin    = $data["fin"] ?? null;

if (!$inicio || !$fin) {
    echo json_encode(["error" => "Fechas inválidas"]);
    exit;
}

// Query que obtiene todas las cuentas dentro del rango
$q = $mysqli->prepare("
    SELECT id_cuenta, id_mesa, fecha, estado, total
    FROM cuentas
    WHERE DATE(fecha) BETWEEN ? AND ?
    ORDER BY fecha DESC
");

$q->bind_param("ss", $inicio, $fin);
$q->execute();
$res = $q->get_result();

$historial = [];

while ($row = $res->fetch_assoc()) {

    $idCuenta = $row["id_cuenta"];

    // Obtener detalle de cada cuenta
    $q2 = $mysqli->prepare("
        SELECT p.nombre, p.precio, d.cantidad, d.subtotal
        FROM cuenta_detalle d
        JOIN productos p ON p.id_producto = d.id_producto
        WHERE d.id_cuenta = ?
    ");

    $q2->bind_param("i", $idCuenta);
    $q2->execute();
    $det = $q2->get_result();

    $detalle = [];
    while ($d = $det->fetch_assoc()) {
        $detalle[] = $d;
    }

    $row["detalle"] = $detalle;
    $historial[] = $row;
}

echo json_encode($historial, JSON_UNESCAPED_UNICODE);
