<?php
session_start();

if (!isset($_SESSION["user_id"]) || $_SESSION["rol"] !== "cocinero") {
    header("Location: ../login.html");
    exit;
}
