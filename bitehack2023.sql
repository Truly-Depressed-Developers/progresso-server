-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 15 Sty 2023, 10:03
-- Wersja serwera: 10.4.27-MariaDB
-- Wersja PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `bitehack2023`
--
CREATE DATABASE IF NOT EXISTS `bitehack2023` DEFAULT CHARACTER SET utf8 COLLATE utf8_polish_ci;
USE `bitehack2023`;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL,
  `description` text NOT NULL,
  `photo_url` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `achievements`
--

INSERT INTO `achievements` (`id`, `name`, `description`, `photo_url`) VALUES
(1, 'First Step!', 'Awarded for uploading their first file!', 'testicon-4.png'),
(2, 'They love me, don\'t they?', 'Awarded for gaining 5 likes on a single post', 'testicon-2.png'),
(3, 'Vent', 'Awarded for being particularly sussy', 'vent.jpg');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `answers`
--

CREATE TABLE `answers` (
  `id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  `correct` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `answers`
--

INSERT INTO `answers` (`id`, `question_id`, `answer`, `correct`) VALUES
(2, 5, 'Poprawna odpowiedź', 1),
(3, 5, 'Niepoprawna odpowiedź', 0),
(4, 6, 'Niepoprawna odpowiedź 1/3', 0),
(5, 6, 'Niepoprawna odpowiedź 2/3', 0),
(6, 6, 'Niepoprawna odpowiedź 3/3', 0),
(7, 6, 'Poprawna odpowiedź', 1),
(8, 7, 'Przed siebie', 0),
(9, 7, 'Po japko', 1),
(10, 7, 'Na spanko', 0),
(11, 8, 'Gaming', 0),
(12, 8, 'Biwooo', 1),
(13, 8, 'Spanko >>>>', 0),
(17, 15, 'Tak', 1),
(18, 15, 'Nie', 0),
(19, 15, 'N', 0);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `files`
--

CREATE TABLE `files` (
  `id` char(36) NOT NULL,
  `extension` varchar(20) NOT NULL,
  `originalName` varchar(512) NOT NULL,
  `uploadTimestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `files`
--

INSERT INTO `files` (`id`, `extension`, `originalName`, `uploadTimestamp`) VALUES
('09dc13a6-de13-4bb2-aeaa-495128649691', 'pdf', '(Dolciani Mathematical Expositions) Paul R. Halmos - Linear Algebra Problem Book-The Mathematical Association of America (1995)', '2023-01-14 21:37:39'),
('19c47060-9415-41a6-b0a4-bb60f9c00b8a', 'pdf', 'Sheldon Axler - Linear Algebra Done Right-Springer (2004)', '2023-01-15 05:36:14'),
('1f3a7387-24df-4e0b-80f8-3cc92963c687', 'pdf', 'zestaw06', '2023-01-14 20:57:46'),
('20adbeeb-b151-4384-b680-fed06f70ba31', 'png', 'profile', '2023-01-14 21:33:31'),
('20f059db-9341-4f75-9c88-5a763c86e5c8', 'pdf', 'Sheldon Axler - Linear Algebra Done Right-Springer (2004)', '2023-01-15 05:37:33'),
('36595cb9-d7b0-4234-8040-3870aa7cd1ce', 'pdf', '(Dolciani Mathematical Expositions) Paul R. Halmos - Linear Algebra Problem Book-The Mathematical Association of America (1995)', '2023-01-15 03:37:29'),
('60cf5069-54d2-46a7-9757-f5beb01081ef', 'pdf', 'Sheldon Axler - Linear Algebra Done Right-Springer (2004)', '2023-01-15 05:35:49'),
('897103e0-ad37-434b-b7da-c4bbdc8bb54e', 'pdf', 'W01', '2023-01-14 21:01:20'),
('9aec559b-11c0-4f19-b0f9-2bbe8ff83bca', 'jpg', 'default-profile-picture', '2023-01-15 07:41:46'),
('cb39a399-c3ba-4426-bb5d-81591f5c7da8', 'pdf', '_wiczenia_6 (1)', '2023-01-15 06:29:59'),
('f1f69718-8071-4aa4-92c4-71f69855208d', 'pdf', 'BITEhack_2023_-_Zadanie_Kategoria_AI', '2023-01-14 17:35:20');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `points_history`
--

CREATE TABLE `points_history` (
  `id` int(11) NOT NULL,
  `user_id` char(36) NOT NULL,
  `points` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `activity_name` varchar(256) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `points_history`
--

INSERT INTO `points_history` (`id`, `user_id`, `points`, `skill_id`, `activity_id`, `activity_name`, `timestamp`) VALUES
(15, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 5, 1, 1, 'Calculus 1 - Easy mode', '2023-01-15 07:23:22'),
(16, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 15, 1, 1, 'Calculus 1 - Hard mode', '2023-01-15 07:23:43'),
(17, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 7, 4, 1, 'WW2', '2023-01-15 07:24:05'),
(18, '46b5c892-9b0f-4148-b8f2-0af3e1f7c436', 9, 6, 3, 'Being a Real Gamer (tm)', '2023-01-15 07:24:39'),
(19, '46b5c892-9b0f-4148-b8f2-0af3e1f7c436', 5, 5, 1, 'React for Beginners', '2023-01-15 07:25:16'),
(20, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 13, 2, 1, 'General Knowledge', '2023-01-15 07:25:39'),
(21, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 3, 2, 1, 'General Knowledge', '2023-01-15 07:37:14'),
(22, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 3, 2, 1, 'General Knowledge', '2023-01-15 07:37:14');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `points_history_activitites`
--

CREATE TABLE `points_history_activitites` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `points_history_activitites`
--

INSERT INTO `points_history_activitites` (`id`, `name`) VALUES
(1, 'Quiz'),
(2, 'Like'),
(3, 'Achievement');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `questions`
--

CREATE TABLE `questions` (
  `id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `question` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `questions`
--

INSERT INTO `questions` (`id`, `quiz_id`, `question`) VALUES
(5, 5, 'Pytanie 1'),
(6, 5, 'Pytanie 2'),
(7, 5, 'Dokąd tupta nocą jeż?'),
(8, 5, 'Czemu nie uczyłem się do sesji?'),
(15, 5, 'Test');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `quizes`
--

CREATE TABLE `quizes` (
  `id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `name` varchar(36) NOT NULL,
  `question_count` int(11) NOT NULL,
  `reward` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `quizes`
--

INSERT INTO `quizes` (`id`, `skill_id`, `name`, `question_count`, `reward`) VALUES
(5, 2, 'General Knowledge', 2, 3),
(6, 6, 'SCP-2137', 4, 5),
(10, 1, 'Calculus 1 - Easy mode', 10, 8);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `skills`
--

CREATE TABLE `skills` (
  `id` int(11) NOT NULL,
  `name` varchar(128) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `skills`
--

INSERT INTO `skills` (`id`, `name`) VALUES
(1, 'Calculus 1'),
(2, 'General Knowledge'),
(3, 'English'),
(4, 'World War 2'),
(5, 'React'),
(6, 'Real Gamer (tm)');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `titles`
--

CREATE TABLE `titles` (
  `id` int(11) NOT NULL,
  `title` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `titles`
--

INSERT INTO `titles` (`id`, `title`) VALUES
(1, 'Java behemoth'),
(2, 'Koltin mastah'),
(3, 'Sussy Impostor');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` char(36) NOT NULL,
  `username` varchar(30) NOT NULL,
  `password` text NOT NULL,
  `title` int(11) DEFAULT NULL,
  `profile_photo_id` char(36) DEFAULT '9aec559b-11c0-4f19-b0f9-2bbe8ff83bca',
  `bio` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `title`, `profile_photo_id`, `bio`) VALUES
('1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 'admin', '�iv�A���M�߱g��s�K��o*�H�', 3, '20adbeeb-b151-4384-b680-fed06f70ba31', 'no admin no'),
('46b5c892-9b0f-4148-b8f2-0af3e1f7c436', 'nowy', 'V�Xb[���*�j���xC�\n	�u곪}�', NULL, '9aec559b-11c0-4f19-b0f9-2bbe8ff83bca', 'still a newbie :D');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user_achievements`
--

CREATE TABLE `user_achievements` (
  `id` int(11) NOT NULL,
  `user_id` char(36) NOT NULL,
  `achievement_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `user_achievements`
--

INSERT INTO `user_achievements` (`id`, `user_id`, `achievement_id`) VALUES
(1, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 1),
(2, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 2),
(3, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 3),
(4, '46b5c892-9b0f-4148-b8f2-0af3e1f7c436', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `user_skills`
--

CREATE TABLE `user_skills` (
  `id` int(11) NOT NULL,
  `user_id` char(36) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `points` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `user_skills`
--

INSERT INTO `user_skills` (`id`, `user_id`, `skill_id`, `points`) VALUES
(1, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 1, 21),
(2, '1df1bb5f-bbe6-4107-a6dd-40e3d3259681', 2, 37);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `answers`
--
ALTER TABLE `answers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Indeksy dla tabeli `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `points_history`
--
ALTER TABLE `points_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `activity_id` (`activity_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indeksy dla tabeli `points_history_activitites`
--
ALTER TABLE `points_history_activitites`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `questions`
--
ALTER TABLE `questions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `question` (`question`) USING HASH,
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indeksy dla tabeli `quizes`
--
ALTER TABLE `quizes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- Indeksy dla tabeli `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `titles`
--
ALTER TABLE `titles`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `profile_photo_id` (`profile_photo_id`),
  ADD KEY `title` (`title`);

--
-- Indeksy dla tabeli `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `achievement_id` (`achievement_id`);

--
-- Indeksy dla tabeli `user_skills`
--
ALTER TABLE `user_skills`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `skill_id` (`skill_id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `answers`
--
ALTER TABLE `answers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT dla tabeli `points_history`
--
ALTER TABLE `points_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT dla tabeli `points_history_activitites`
--
ALTER TABLE `points_history_activitites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `questions`
--
ALTER TABLE `questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT dla tabeli `quizes`
--
ALTER TABLE `quizes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT dla tabeli `skills`
--
ALTER TABLE `skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT dla tabeli `titles`
--
ALTER TABLE `titles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `user_achievements`
--
ALTER TABLE `user_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT dla tabeli `user_skills`
--
ALTER TABLE `user_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `answers`
--
ALTER TABLE `answers`
  ADD CONSTRAINT `answers_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`);

--
-- Ograniczenia dla tabeli `points_history`
--
ALTER TABLE `points_history`
  ADD CONSTRAINT `points_history_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `points_history_activitites` (`id`),
  ADD CONSTRAINT `points_history_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `points_history_ibfk_3` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`);

--
-- Ograniczenia dla tabeli `questions`
--
ALTER TABLE `questions`
  ADD CONSTRAINT `questions_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizes` (`id`);

--
-- Ograniczenia dla tabeli `quizes`
--
ALTER TABLE `quizes`
  ADD CONSTRAINT `quizes_ibfk_1` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`);

--
-- Ograniczenia dla tabeli `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`profile_photo_id`) REFERENCES `files` (`id`),
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`title`) REFERENCES `titles` (`id`);

--
-- Ograniczenia dla tabeli `user_achievements`
--
ALTER TABLE `user_achievements`
  ADD CONSTRAINT `user_achievements_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`);

--
-- Ograniczenia dla tabeli `user_skills`
--
ALTER TABLE `user_skills`
  ADD CONSTRAINT `user_skills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `user_skills_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;


-- create user
CREATE USER bitehack2023 IDENTIFIED BY '28pTQYMQH9qomf';

-- set user privileges
GRANT ALL PRIVILEGES ON bitehack2023. * TO 'bitehack2023';
