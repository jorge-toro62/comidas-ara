<?php
require_once "conexion.php";

header("Content-Type: application/json");

$mesa = intval($_GET["mesa"]);

// -----------------------------------------------------
// 1. SI LA TABLA MESAS NO EXISTE O NO TIENE REGISTROS
//    → permitir abrir la mesa sin error
// -----------------------------------------------------
$checkMesa = $mysqli->prepare("SHOW TABLES LIKE 'mesas'");
$checkMesa->execute();
$tableExists = $checkMesa->get_result()->num_rows > 0;

if ($tableExists) {

    // Verificar si la mesa existe
    $checkMesa2 = $mysqli->prepare("SELECT id_mesa FROM mesas WHERE id_mesa = ?");
    $checkMesa2->bind_param("i", $mesa);
    $checkMesa2->execute();
    $resMesa = $checkMesa2->get_result();

    if ($resMesa->num_rows == 0) {
        // ⚠️ En vez de error → permitir abrir la mesa vacía
        echo json_encode([
            "id_mesa" => $mesa,
            "id_cuenta" => null,
            "total" => 0,
            "detalle" => []
        ]);
        exit;
    }
}

// -----------------------------------------------------
// 2. Obtener o crear la cuenta
// -----------------------------------------------------
$qCuenta = $mysqli->prepare("SELECT id_cuenta FROM cuentas WHERE id_mesa = ?");
$qCuenta->bind_param("i", $mesa);
$qCuenta->execute();
$resCuenta = $qCuenta->get_result();

if ($resCuenta->num_rows == 0) {

    // Crear nueva cuenta
    $crear = $mysqli->prepare("INSERT INTO cuentas (id_mesa, total, estado, fecha) VALUES (?, 0, 'abierta', NOW())");
    $crear->bind_param("i", $mesa);
    $crear->execute();

    $idCuenta = $crear->insert_id;

} else {
    $row = $resCuenta->fetch_assoc();
    $idCuenta = $row["id_cuenta"];
}

// -----------------------------------------------------
// 3. Obtener detalle
// -----------------------------------------------------
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

// Total real
$total = array_sum(array_column($detalle, "subtotal"));

// -----------------------------------------------------
// 4. Respuesta final
// -----------------------------------------------------
echo json_encode([
    "id_mesa" => $mesa,
    "id_cuenta" => $idCuenta,
    "total" => $total,
    "detalle" => $detalle
]);

?>