-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 04 Des 2023 pada 09.09
-- Versi server: 10.4.28-MariaDB
-- Versi PHP: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_percobaan_user`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `product`
--

CREATE TABLE `product` (
  `id_product` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `photoUrl` varchar(255) NOT NULL,
  `barcode` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `product`
--

INSERT INTO `product` (`id_product`, `name`, `company`, `photoUrl`, `barcode`) VALUES
(1, 'indomie ayam bawang', 'pt.indofood', 'duadanfhwsfefu1231', '12312334234322324'),
(2, 'mejikom', 'pt.mejikom indonesia', 'dawdadferrr3', '343245643621'),
(3, 'oli motor', 'Pt. oli motor terbaik di Indonesia', 'daudhasdjausdgauhd8823103', '23131417126763');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user`
--

CREATE TABLE `user` (
  `id_user` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `isPremium` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user`
--

INSERT INTO `user` (`id_user`, `email`, `username`, `password`, `isPremium`) VALUES
(31, 'qwerty@gmail.com', 'qwerty234', '$2b$10$FQspVeWI2iXsYUb9E2zkJOu11MGG6fg3MoRHkiKpSPKvbr1gsGk..', 0),
(32, 'dudung123@gmail.com', 'dudung', '$2b$10$YsO4IOhweGQzmKoA/xzWxOBEFyYjXtfxXtLgbXjnX3kIqaFm5kpaG', 0),
(33, 'sall2343@gmail.com', 'sall123', '$2b$10$mh17uNqwcPNlpMSxRZfTNeHifZB298a3FzzymY9PX/CFZbb6bgo0S', 0),
(34, 'percobaan@gmail.com', 'percobaan7', '$2b$04$QRKDQvY0/Pr6LOZZm9efuuAUhg0Ca1PmaHw8EP8tvDh74rFpqdfku', 0),
(36, 'percobaan6@gmail.com', 'percobaan7', '$2b$04$8evUfDF0iFGtrOfETwzfgum5EfkkVC4GM62fOYkksgUQcxdVEjvfi', 0),
(37, 'percobaan8@gmail.com', 'percobaan8', '$2b$04$WffXn1FjtU7R2zz6fpz0G.hYoYZ5.0gPmA17Wz40FBwhho/Y3gjxe', 0),
(38, 'percobaan9@gmail.com', 'percobaan9', '$2b$04$3BJbp1CpfTGstC9lfmAuFu5Wfb76cBbTT44q4/k/JPta13ctaCpbm', 0);

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id_product`);

--
-- Indeks untuk tabel `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `product`
--
ALTER TABLE `product`
  MODIFY `id_product` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `user`
--
ALTER TABLE `user`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
