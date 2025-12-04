-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-12-2025 a las 22:38:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `comidas_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuentas`
--

CREATE TABLE `cuentas` (
  `id_cuenta` int(11) NOT NULL,
  `id_mesa` int(11) NOT NULL,
  `total` decimal(10,2) DEFAULT 0.00,
  `estado` enum('abierta','cerrada') DEFAULT 'abierta',
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cuentas`
--

INSERT INTO `cuentas` (`id_cuenta`, `id_mesa`, `total`, `estado`, `fecha`) VALUES
(1, 1, 0.00, 'abierta', '2025-12-04 10:58:55'),
(2, 2, 45500.00, 'abierta', '2025-12-04 13:50:29'),
(3, 3, 0.00, 'abierta', '2025-12-04 14:17:58');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuenta_detalle`
--

CREATE TABLE `cuenta_detalle` (
  `id_detalle` int(11) NOT NULL,
  `id_cuenta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cuenta_detalle`
--

INSERT INTO `cuenta_detalle` (`id_detalle`, `id_cuenta`, `id_producto`, `cantidad`, `subtotal`) VALUES
(14, 2, 8, 3, 45000.00),
(15, 2, 1, 1, 500.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mesas`
--

CREATE TABLE `mesas` (
  `id_mesa` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `estado` enum('libre','ocupada') DEFAULT 'libre'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mesas`
--

INSERT INTO `mesas` (`id_mesa`, `nombre`, `estado`) VALUES
(1, '', 'libre'),
(2, '', 'libre'),
(3, '', 'libre'),
(4, '', 'libre'),
(5, '', 'libre'),
(6, '', 'libre'),
(7, '', 'libre'),
(8, '', 'libre'),
(9, '', 'libre'),
(10, '', 'libre');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `id_pedido` int(11) NOT NULL,
  `id_mesa` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `total` decimal(10,2) DEFAULT NULL,
  `estado` varchar(20) DEFAULT 'pendiente',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`id_pedido`, `id_mesa`, `fecha`, `total`, `estado`, `updated_at`) VALUES
(7, 1, '2025-12-04 14:17:50', 3000.00, 'listo', '2025-12-04 21:20:13'),
(8, 3, '2025-12-04 14:18:19', 17000.00, 'listo', '2025-12-04 21:01:07'),
(9, 2, '2025-12-04 14:19:56', 45500.00, 'listo', '2025-12-04 21:22:39'),
(10, 2, '2025-12-04 15:15:27', 45500.00, 'listo', '2025-12-04 21:22:39'),
(11, 1, '2025-12-04 15:21:10', 16500.00, 'listo', '2025-12-04 21:01:07'),
(12, 1, '2025-12-04 15:57:03', 24000.00, 'listo', '2025-12-04 21:01:07'),
(13, 1, '2025-12-04 16:05:52', 26000.00, 'listo', '2025-12-04 21:06:57'),
(14, 1, '2025-12-04 16:19:02', 1500.00, 'listo', '2025-12-04 21:22:10'),
(15, 1, '2025-12-04 16:19:41', 3000.00, 'listo', '2025-12-04 21:22:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos_detalle`
--

CREATE TABLE `pedidos_detalle` (
  `id_detalle` int(11) NOT NULL,
  `id_pedido` int(11) DEFAULT NULL,
  `id_producto` int(11) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos_detalle`
--

INSERT INTO `pedidos_detalle` (`id_detalle`, `id_pedido`, `id_producto`, `cantidad`, `subtotal`) VALUES
(5, 8, 8, 1, 15000.00),
(6, 8, 19, 1, 1500.00),
(7, 8, 1, 1, 500.00),
(10, 11, 19, 1, 1500.00),
(11, 11, 8, 1, 15000.00),
(12, 12, 19, 6, 9000.00),
(13, 12, 8, 1, 15000.00),
(19, 13, 19, 6, 9000.00),
(20, 13, 8, 1, 15000.00),
(21, 13, 4, 1, 2000.00),
(23, 14, 19, 1, 1500.00),
(26, 15, 19, 2, 3000.00),
(27, 7, 19, 2, 3000.00),
(28, 10, 8, 3, 45000.00),
(29, 10, 1, 1, 500.00),
(30, 9, 8, 3, 45000.00),
(31, 9, 1, 1, 500.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos_historial`
--

CREATE TABLE `pedidos_historial` (
  `id_historial` int(11) NOT NULL,
  `id_pedido` int(11) NOT NULL,
  `id_mesa` int(11) NOT NULL,
  `fecha_pedido` datetime NOT NULL,
  `fecha_listo` datetime NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `detalle` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos_historial`
--

INSERT INTO `pedidos_historial` (`id_historial`, `id_pedido`, `id_mesa`, `fecha_pedido`, `fecha_listo`, `total`, `detalle`) VALUES
(1, 5, 2, '2025-12-04 14:08:25', '2025-12-04 14:08:47', 45000.00, '[{\"nombre\":\"Patacon plus\",\"cantidad\":3,\"subtotal\":\"45000.00\"}]'),
(2, 6, 2, '2025-12-04 14:10:18', '2025-12-04 14:10:32', 45000.00, '[{\"nombre\":\"Patacon plus\",\"cantidad\":3,\"subtotal\":\"45000.00\"}]'),
(3, 8, 3, '2025-12-04 14:18:19', '2025-12-04 14:18:48', 17000.00, '[{\"nombre\":\"Patacon plus\",\"cantidad\":1,\"subtotal\":\"15000.00\"},{\"nombre\":\"Cafe negro\",\"cantidad\":1,\"subtotal\":\"1500.00\"},{\"nombre\":\"Empanada\",\"cantidad\":1,\"subtotal\":\"500.00\"}]'),
(4, 7, 1, '2025-12-04 14:17:50', '2025-12-04 14:18:52', 1500.00, '[{\"nombre\":\"Cafe negro\",\"cantidad\":1,\"subtotal\":\"1500.00\"}]'),
(5, 9, 2, '2025-12-04 14:19:56', '2025-12-04 14:20:05', 45000.00, '[{\"nombre\":\"Patacon plus\",\"cantidad\":3,\"subtotal\":\"45000.00\"}]'),
(6, 10, 2, '2025-12-04 15:15:27', '2025-12-04 15:16:03', 45000.00, '[{\"nombre\":\"Patacon plus\",\"cantidad\":3,\"subtotal\":\"45000.00\"}]'),
(7, 11, 1, '2025-12-04 15:21:10', '2025-12-04 15:21:39', 16500.00, '[{\"nombre\":\"Cafe negro\",\"cantidad\":1,\"subtotal\":\"1500.00\"},{\"nombre\":\"Patacon plus\",\"cantidad\":1,\"subtotal\":\"15000.00\"}]'),
(8, 12, 1, '2025-12-04 15:57:03', '2025-12-04 15:58:01', 24000.00, '[{\"nombre\":\"Cafe negro\",\"cantidad\":6,\"subtotal\":\"9000.00\"},{\"nombre\":\"Patacon plus\",\"cantidad\":1,\"subtotal\":\"15000.00\"}]'),
(9, 13, 1, '2025-12-04 16:05:52', '2025-12-04 16:06:57', 26000.00, '[{\"nombre\":\"Cafe negro\",\"cantidad\":6,\"subtotal\":\"9000.00\"},{\"nombre\":\"Patacon plus\",\"cantidad\":1,\"subtotal\":\"15000.00\"},{\"nombre\":\"Aborrajado\",\"cantidad\":1,\"subtotal\":\"2000.00\"}]'),
(10, 15, 1, '2025-12-04 16:19:41', '2025-12-04 16:22:07', 3000.00, '[{\"nombre\":\"Cafe negro\",\"cantidad\":2,\"subtotal\":\"3000.00\"}]'),
(11, 14, 1, '2025-12-04 16:19:02', '2025-12-04 16:22:10', 1500.00, '[{\"nombre\":\"Cafe negro\",\"cantidad\":1,\"subtotal\":\"1500.00\"}]');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `nombre`, `precio`, `categoria`) VALUES
(1, 'Empanada', 500.00, NULL),
(2, 'Pastel de pollo', 700.00, NULL),
(3, 'Papa aborrajada', 500.00, NULL),
(4, 'Aborrajado', 2000.00, NULL),
(5, 'Ala rellena', 5000.00, NULL),
(6, 'Ala Aborrajada', 3000.00, NULL),
(7, 'Patacon sencillo', 10000.00, NULL),
(8, 'Patacon plus', 15000.00, NULL),
(9, 'Dedo de reina', 3000.00, NULL),
(10, 'Hawahiana', 6000.00, NULL),
(11, 'Trompa aborrajada', 3000.00, NULL),
(12, 'Trompa guisada', 5000.00, NULL),
(13, 'Agua', 2000.00, NULL),
(14, 'Agua con gas', 3000.00, NULL),
(15, 'Cocacola 350', 3500.00, NULL),
(16, 'Postobon 350', 3500.00, NULL),
(17, 'Postobon 1.5L', 5000.00, NULL),
(18, 'Cocacola 1.5L', 7000.00, NULL),
(19, 'Cafe negro', 1500.00, NULL),
(20, 'Milo frio', 5000.00, NULL),
(21, 'Hamburguesa', 15000.00, NULL),
(22, 'Gaseosa', 5000.00, NULL),
(23, 'Perro caliente', 12000.00, NULL),
(24, 'Salchipapa', 10000.00, NULL),
(25, 'Jugo natural', 7000.00, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','cocinero') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`, `rol`) VALUES
(1, 'admin', '81dc9bdb52d04dc20036dbd8313ed055', 'admin'),
(2, 'cocinero1', '8da21b93c854ee7492014ac709754fa0', 'cocinero');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cuentas`
--
ALTER TABLE `cuentas`
  ADD PRIMARY KEY (`id_cuenta`),
  ADD KEY `id_mesa` (`id_mesa`);

--
-- Indices de la tabla `cuenta_detalle`
--
ALTER TABLE `cuenta_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_cuenta` (`id_cuenta`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `mesas`
--
ALTER TABLE `mesas`
  ADD PRIMARY KEY (`id_mesa`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`id_pedido`),
  ADD KEY `id_mesa` (`id_mesa`);

--
-- Indices de la tabla `pedidos_detalle`
--
ALTER TABLE `pedidos_detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `id_pedido` (`id_pedido`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `pedidos_historial`
--
ALTER TABLE `pedidos_historial`
  ADD PRIMARY KEY (`id_historial`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `cuentas`
--
ALTER TABLE `cuentas`
  MODIFY `id_cuenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `cuenta_detalle`
--
ALTER TABLE `cuenta_detalle`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `mesas`
--
ALTER TABLE `mesas`
  MODIFY `id_mesa` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `id_pedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `pedidos_detalle`
--
ALTER TABLE `pedidos_detalle`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `pedidos_historial`
--
ALTER TABLE `pedidos_historial`
  MODIFY `id_historial` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cuentas`
--
ALTER TABLE `cuentas`
  ADD CONSTRAINT `cuentas_ibfk_1` FOREIGN KEY (`id_mesa`) REFERENCES `mesas` (`id_mesa`);

--
-- Filtros para la tabla `cuenta_detalle`
--
ALTER TABLE `cuenta_detalle`
  ADD CONSTRAINT `cuenta_detalle_ibfk_1` FOREIGN KEY (`id_cuenta`) REFERENCES `cuentas` (`id_cuenta`) ON DELETE CASCADE,
  ADD CONSTRAINT `cuenta_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`id_mesa`) REFERENCES `mesas` (`id_mesa`);

--
-- Filtros para la tabla `pedidos_detalle`
--
ALTER TABLE `pedidos_detalle`
  ADD CONSTRAINT `pedidos_detalle_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`),
  ADD CONSTRAINT `pedidos_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
