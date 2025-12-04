<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "conexion.php";
header("Content-Type: application/json");

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data || !isset($data["username"]) || !isset($data["password"])) {
    echo json_encode(["ok" => false, "error" => "Datos inválidos"]);
    exit;
}

$username = $data["username"];
$password = md5($data["password"]); // hash MD5

$sql = $mysqli->prepare("SELECT username, rol FROM usuarios WHERE username = ? AND password = ?");
$sql->bind_param("ss", $username, $password);
$sql->execute();
$result = $sql->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["ok" => false]);
    exit;
}

$user = $result->fetch_assoc();

echo json_encode([
    "ok" => true,
    "rol" => $user["rol"]
]);
