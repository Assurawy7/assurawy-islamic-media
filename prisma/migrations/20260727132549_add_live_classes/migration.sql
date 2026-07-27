/*
  Warnings:

  - You are about to drop the column `duration` on the `LiveClass` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `LiveClass` table. All the data in the column will be lost.
  - You are about to drop the column `isLive` on the `LiveClass` table. All the data in the column will be lost.
  - You are about to drop the column `meetingId` on the `LiveClass` table. All the data in the column will be lost.
  - You are about to drop the column `meetingPass` on the `LiveClass` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `LiveClass` table. All the data in the column will be lost.
  - You are about to drop the column `recordingUrl` on the `LiveClass` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LiveClass" DROP CONSTRAINT "LiveClass_courseId_fkey";

-- AlterTable
ALTER TABLE "LiveClass" DROP COLUMN "duration",
DROP COLUMN "isCompleted",
DROP COLUMN "isLive",
DROP COLUMN "meetingId",
DROP COLUMN "meetingPass",
DROP COLUMN "provider",
DROP COLUMN "recordingUrl",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'UPCOMING',
ALTER COLUMN "courseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "LiveClass" ADD CONSTRAINT "LiveClass_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;
