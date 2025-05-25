-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 23 mai 2025 à 19:12
-- Version du serveur : 8.2.0
-- Version de PHP : 8.2.13

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `hopital`
--

-- --------------------------------------------------------

--
-- Structure de la table `avis`
--

DROP TABLE IF EXISTS `avis`;
CREATE TABLE IF NOT EXISTS `avis` (
  `id` int NOT NULL AUTO_INCREMENT,
  `medecin_id` int NOT NULL,
  `patient_id` int NOT NULL,
  `note` int DEFAULT NULL,
  `commentaire` text,
  `date_avis` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `medecin_id` (`medecin_id`),
  KEY `patient_id` (`patient_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `departement`
--

DROP TABLE IF EXISTS `departement`;
CREATE TABLE IF NOT EXISTS `departement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom_depart` varchar(100) NOT NULL,
  `description` text,
  `classe_pred` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `departement`
--

INSERT INTO `departement` (`id`, `nom_depart`, `description`, `classe_pred`) VALUES
(1, 'Endocrinologie et Diabétologie', 'Prise en charge des maladies endocriniennes et métaboliques (ex: diabète).', 'Diabetes'),
(2, 'Cardiologie', 'Suivi des affections cardiovasculaires, y compris les maladies cardiaques.', 'Heart Di'),
(4, 'Thalassémie', 'Prise en charge des maladies du sang, notamment les thalassémies.', 'Thalasse'),
(5, 'Hématologie', 'Diagnostic et traitement des troubles de l'hémoglobine et des anémies diverses.', 'Anemia'),
(6, 'Thrombocytopathies', 'Gestion des troubles de la coagulation et des pathologies vasculaires.', 'Thromboc');

-- --------------------------------------------------------

--
-- Structure de la table `medecins`
--

DROP TABLE IF EXISTS `medecins`;
CREATE TABLE IF NOT EXISTS `medecins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `grade` varchar(100) DEFAULT NULL,
  `departement_id` int DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `specialite` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `medecins`
--

INSERT INTO `medecins` (`id`, `nom`, `email`, `mot_de_passe`, `grade`, `departement_id`, `photo_url`, `date_creation`, `specialite`) VALUES
(1, 'Dr. Amina Rami', 'amina.rami@hopital.com', 'pass123', 'Professeur', 1, '/images/amina.webp', '2025-05-23 19:05:48', 'Endocrinologue'),
(2, 'Dr. Youssef Badaoui', 'youssef.badaoui@hopital.com', 'pass123', 'Spécialiste', 1, '/images/youssef.webp', '2025-05-23 19:05:48', 'Diabétologue'),
(3, 'Dr. Nadia Skalli', 'nadia.skalli@hopital.com', 'pass123', 'Docteure', 1, '/images/nadia.webp', '2025-05-23 19:05:48', 'Nutritionniste'),
(4, 'Dr. Karim El Idrissi', 'karim.elidrissi@hopital.com', 'pass123', 'Professeur', 2, '/images/karim.webp', '2025-05-23 19:05:48', 'Cardiologue'),
(5, 'Dr. Rim Haddad', 'rim.haddad@hopital.com', 'pass123', 'Docteure', 2, '/images/rim.webp', '2025-05-23 19:05:48', 'Chirurgien cardiaque'),
(6, 'Dr. Sami Lamrani', 'sami.lamrani@hopital.com', 'pass123', 'Spécialiste', 2, '/images/sami.webp', '2025-05-23 19:05:48', 'Rythmologue'),
(7, 'Dr. Hajar Belkadi', 'hajar.belkadi@hopital.com', 'pass123', 'Docteure', 3, '/images/hajar.webp', '2025-05-23 19:05:48', 'Hématologue pédiatrique'),
(8, 'Dr. Rachid Naciri', 'rachid.naciri@hopital.com', 'pass123', 'Professeur', 3, '/images/rachid.webp', '2025-05-23 19:05:48', 'Généticien'),
(9, 'Dr. Fatima Zahra Bennis', 'fatima.bennis@hopital.com', 'pass123', 'Spécialiste', 3, '/images/fatima.webp', '2025-05-23 19:05:48', 'Médecin des maladies rares'),
(10, 'Dr. Reda Tazi', 'reda.tazi@hopital.com', 'pass123', 'Docteur', 4, '/images/reda.webp', '2025-05-23 19:05:49', 'Hématologue'),
(11, 'Dr. Imane El Ghazali', 'imane.ghazali@hopital.com', 'pass123', 'Docteure', 4, '/images/imane.webp', '2025-05-23 19:05:49', 'Biologiste médical'),
(12, 'Dr. Jalil Mekki', 'jalil.mekki@hopital.com', 'pass123', 'Spécialiste', 4, '/images/jalil.webp', '2025-05-23 19:05:49', 'Médecin nutritionniste'),
(13, 'Dr. Laila Ait Taleb', 'laila.aittaleb@hopital.com', 'pass123', 'Docteure', 5, '/images/laila.webp', '2025-05-23 19:05:49', 'Spécialiste en coagulation'),
(14, 'Dr. Soufiane Malki', 'soufiane.malki@hopital.com', 'pass123', 'Professeur', 5, '/images/soufiane.webp', '2025-05-23 19:05:49', 'Hématologue plaquettaire'),
(15, 'Dr. Hanane Driouch', 'hanane.driouch@hopital.com', 'pass123', 'Spécialiste', 5, '/images/hanane.webp', '2025-05-23 19:05:49', 'Médecin vasculaire');

-- --------------------------------------------------------

--
-- Structure de la table `patients`
--

DROP TABLE IF EXISTS `patients`;
CREATE TABLE IF NOT EXISTS `patients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `date_naissance` date DEFAULT NULL,
  `sexe` enum('Homme','Femme') DEFAULT 'Homme',
  `date_creation` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `patients`
--

INSERT INTO `patients` (`id`, `nom`, `email`, `mot_de_passe`, `date_naissance`, `sexe`, `date_creation`) VALUES
(1, 'Amine Benaissa', 'amine.benaissa@gmail.com', 'amine123', '1997-08-12', 'Homme', '2025-04-15 18:36:45'),
(2, 'Sara Mounir', 'sara.mounir@yahoo.com', 'sara456', '1995-04-25', 'Femme', '2025-04-15 18:36:45'),
(3, 'Youssef El Idrissi', 'youssef.idrissi@outlook.com', 'youssef789', '2000-01-18', 'Homme', '2025-04-15 18:36:45'),
(6, 'oulali samya', 'oulalisamya3@gmail.com', 'sam123', '2003-08-17', '', '2025-05-18 18:57:14'),
(5, 'samya', 'oulalisamya2@gmail.com', 'Samya1234', '2003-08-17', '', '2025-05-04 20:12:46'),
(7, 'imad', 'imad@imad', 'imad123', '2003-03-07', '', '2025-05-20 00:50:02');

-- --------------------------------------------------------

--
-- Structure de la table `reset_codes`
--

DROP TABLE IF EXISTS `reset_codes`;
CREATE TABLE IF NOT EXISTS `reset_codes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `code` varchar(6) NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reset_codes_email` (`email`(250)),
  KEY `idx_reset_codes_code` (`code`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Structure de la table `predictions`
--

DROP TABLE IF EXISTS `predictions`;
CREATE TABLE IF NOT EXISTS `predictions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `prediction` varchar(50) NOT NULL,
  `probabilities` JSON NOT NULL,
  `recommendations` JSON NOT NULL,
  `departement_id` int NOT NULL,
  `date_prediction` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `patient_id` (`patient_id`),
  KEY `departement_id` (`departement_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
