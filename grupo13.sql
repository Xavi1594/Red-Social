-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 10-05-2023 a las 18:46:44
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

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
-- Estructura de tabla para la tabla `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `usuarioId` int(11) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `post`
--

INSERT INTO `post` (`id`, `title`, `content`, `usuarioId`, `createdAt`, `updatedAt`) VALUES
(1, 'Mi primer post', 'Este es el contenido de mi primer post. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales justo vel augue convallis, non volutpat purus consequat. Nunc ullamcorper vel magna a lacinia. Nulla facilisi. In rutrum purus vitae tincidunt fermentum.', 1, '2023-05-08 15:47:30', '2023-05-08 15:47:30'),
(2, 'Mi segundo post', 'Este es el contenido de mi segundo post. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales justo vel augue convallis, non volutpat purus consequat. Nunc ullamcorper vel magna a lacinia. Nulla facilisi. In rutrum purus vitae tincidunt fermentum.', 1, '2023-05-09 10:22:45', '2023-05-09 10:22:45');

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
(5, 'Xavi112', '1234567', 'digital@digi.com', 'pedro pepe', 'Paris', 'Francia', 32, 'aaaaaaaaaaa', 'sssssssssss', 'zzzzzzzzzzzzzzzz', 'https://www.linkedin.com/'),
(6, 'Xavi', 'herropa', 'xavi7777@hotmail.com', 'xavi', 'Alicante', 'españota', 55, 'aa', 'pocos', 'aaa', 'https://www.linkedin.com/'),
(7, 'Fran', '123456', 'fran@hotmail.com', 'francisco', 'gijon', 'españa', 16, 'ss', 'sss', 'sss', 'https://www.linkedin.com/'),
(13, 'Jose ', '123456', 'xavi9415@hotmail.com', 'xavier ', 'gijon', 'españa', 33, 'pocos', 'mo', 'sss', 'https://www.linkedin.com/');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarioId` (`usuarioId`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username_2` (`username`,`email`),
  ADD KEY `username` (`username`,`email`),
  ADD KEY `university` (`university`),
  ADD KEY `university_2` (`university`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
