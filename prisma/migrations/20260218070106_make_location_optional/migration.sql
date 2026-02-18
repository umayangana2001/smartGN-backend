-- DropForeignKey
ALTER TABLE `userprofile` DROP FOREIGN KEY `UserProfile_districtId_fkey`;

-- DropForeignKey
ALTER TABLE `userprofile` DROP FOREIGN KEY `UserProfile_divisionId_fkey`;

-- DropForeignKey
ALTER TABLE `userprofile` DROP FOREIGN KEY `UserProfile_provinceId_fkey`;

-- DropIndex
DROP INDEX `UserProfile_districtId_fkey` ON `userprofile`;

-- DropIndex
DROP INDEX `UserProfile_divisionId_fkey` ON `userprofile`;

-- DropIndex
DROP INDEX `UserProfile_provinceId_fkey` ON `userprofile`;

-- AlterTable
ALTER TABLE `userprofile` MODIFY `provinceId` VARCHAR(191) NULL,
    MODIFY `districtId` VARCHAR(191) NULL,
    MODIFY `divisionId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD CONSTRAINT `UserProfile_provinceId_fkey` FOREIGN KEY (`provinceId`) REFERENCES `Province`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD CONSTRAINT `UserProfile_districtId_fkey` FOREIGN KEY (`districtId`) REFERENCES `District`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserProfile` ADD CONSTRAINT `UserProfile_divisionId_fkey` FOREIGN KEY (`divisionId`) REFERENCES `Division`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
