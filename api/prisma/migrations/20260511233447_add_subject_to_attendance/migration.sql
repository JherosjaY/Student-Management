/*
  Warnings:

  - A unique constraint covering the columns `[studentId,classId,subjectId,date]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "attendance_studentId_classId_date_key";

-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "subjectId" UUID;

-- CreateIndex
CREATE INDEX "attendance_subjectId_date_idx" ON "attendance"("subjectId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_studentId_classId_subjectId_date_key" ON "attendance"("studentId", "classId", "subjectId", "date");

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
