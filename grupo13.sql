-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-04-2023 a las 16:37:09
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `grupo13`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `email` varchar(20) NOT NULL,
  `fullname` text NOT NULL,
  `city` text NOT NULL,
  `country` text NOT NULL,
  `age` int(3) NOT NULL,
  `university` varchar(20) NOT NULL,
  `languages` varchar(30) NOT NULL,
  `hobbies` varchar(30) NOT NULL,
  `linkedin` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`, `email`, `fullname`, `city`, `country`, `age`, `university`, `languages`, `hobbies`, `linkedin`) VALUES
(1, 'shirox', '123456', 'lalo@lalo.com', 'lalo', 'Gijon', 'España', 33, 'aaaaaaaa', 'd, e y f', 'fffffffffff', 'https://www.linkedin.com/'),
(3, 'mepax', '123456', 'digitalstreaming2@gm', 'lalo garza garcia', 'Gijon', 'España', 55, 'qqqqqqqqq', 'b,b,b ', 'ccccccccccc', 'https://www.linkedin.com/'),
(4, 'abraxas', '123456', 'esese@sese.com', 'pepe asterias', 'Madrid', 'España', 44, 'aaaaaaaa', 'b,b,b ', 'jjjjjjjjjjj', 'https://www.linkedin.com/'),
(5, 'Xavi112', '1234567', 'digital@digi.com', 'pedro pepe', 'Paris', 'Francia', 32, 'aaaaaaaaaaa', 'sssssssssss', 'zzzzzzzzzzzzzzzz', 'https://www.linkedin.com/');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username_2` (`username`,`email`),
  ADD KEY `username` (`username`,`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
