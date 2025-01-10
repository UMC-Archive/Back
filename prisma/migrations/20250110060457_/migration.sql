/*
  Warnings:

  - Added the required column `inactive_date` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile_image` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `social_type` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `user` table without a default value. This is not possible if the table is not empty.
  - Made the column `name` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    ADD COLUMN `inactive_date` DATETIME(6) NOT NULL,
    ADD COLUMN `nickname` VARCHAR(20) NOT NULL,
    ADD COLUMN `password` VARCHAR(100) NOT NULL,
    ADD COLUMN `profile_image` VARCHAR(1000) NOT NULL,
    ADD COLUMN `social_type` VARCHAR(100) NOT NULL,
    ADD COLUMN `status` VARCHAR(100) NOT NULL,
    ADD COLUMN `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    MODIFY `name` VARCHAR(20) NOT NULL,
    MODIFY `email` VARCHAR(50) NOT NULL;

-- CreateTable
CREATE TABLE `time_history` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `history` DATETIME(6) NOT NULL,
    `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `artist` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(20) NOT NULL,
    `image` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genre` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(1000) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_genre` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `genre_id` BIGINT NOT NULL,
    `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `genre_id`(`genre_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_artist` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `artist_id` BIGINT NOT NULL,
    `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `artist_id`(`artist_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `album` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(20) NOT NULL,
    `description` TEXT NOT NULL,
    `relese_time` DATETIME(6) NOT NULL,
    `image` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `music` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `Album_id` BIGINT NOT NULL,
    `title` VARCHAR(20) NOT NULL,
    `relese_time` DATETIME(6) NOT NULL,
    `lyrics` TEXT NOT NULL,
    `image` VARCHAR(1000) NOT NULL,
    `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `album_id`(`Album_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `music_genre` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `music_id` BIGINT NOT NULL,
    `genre_id` BIGINT NOT NULL,
    `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `genre_id`(`genre_id`),
    INDEX `music_id`(`music_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `music_artist` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `music_id` BIGINT NOT NULL,
    `artist_id` BIGINT NOT NULL,
    `created_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NULL DEFAULT CURRENT_TIMESTAMP(6),

    INDEX `artist_id`(`artist_id`),
    INDEX `music_id`(`music_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `time_history` ADD CONSTRAINT `time_history_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_genre` ADD CONSTRAINT `user_genre_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_genre` ADD CONSTRAINT `user_genre_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `genre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_artist` ADD CONSTRAINT `user_artist_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_artist` ADD CONSTRAINT `user_artist_artist_id_fkey` FOREIGN KEY (`artist_id`) REFERENCES `artist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `music` ADD CONSTRAINT `music_Album_id_fkey` FOREIGN KEY (`Album_id`) REFERENCES `album`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `music_genre` ADD CONSTRAINT `music_genre_music_id_fkey` FOREIGN KEY (`music_id`) REFERENCES `music`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `music_genre` ADD CONSTRAINT `music_genre_genre_id_fkey` FOREIGN KEY (`genre_id`) REFERENCES `genre`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `music_artist` ADD CONSTRAINT `music_artist_music_id_fkey` FOREIGN KEY (`music_id`) REFERENCES `music`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `music_artist` ADD CONSTRAINT `music_artist_artist_id_fkey` FOREIGN KEY (`artist_id`) REFERENCES `artist`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
