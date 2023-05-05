-- AlterTable
ALTER TABLE `User` ADD COLUMN `bio` TEXT NULL,
    ADD COLUMN `website` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Instruction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `step` TEXT NOT NULL,
    `priority` INTEGER NOT NULL,
    `recipeId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Instruction` ADD CONSTRAINT `Instruction_recipeId_fkey` FOREIGN KEY (`recipeId`) REFERENCES `Recipe`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
