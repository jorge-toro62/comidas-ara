<?php
require_once "conexion.php";

header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !isset($data["mesa"])) {
    echo json_encode(["ok" => false, "error" => "Datos inválidos"]);
    exit;
}

$mesa = intval($data["mesa"]);

// Buscar cuenta activa
$q = $mysqli->prepare("SELECT id_cuenta FROM cuentas WHERE id_mesa = ? AND estado = 'abierta'");
$q->bind_param("i", $mesa);
$q->execute();
$res = $q->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["ok" => false, "error" => "No existe una cuenta activa"]);
    exit;
}

$idCuenta = $res->fetch_assoc()["id_cuenta"];

// Eliminar detales
$del = $mysqli->prepare("DELETE FROM cuenta_detalle WHERE id_cuenta = ?");
$del->bind_param("i", $idCuenta);
$del->execute();

// Poner total en 0
$upd = $mysqli->prepare("UPDATE cuentas SET total = 0 WHERE id_cuenta = ?");
$upd->bind_param("i", $idCuenta);
$upd->execute();

echo json_encode(["ok" => true]);
?>
