/*
  Warnings:

  - You are about to drop the column `status` on the `Note` table. All the data in the column will be lost.
  - Added the required column `statusID` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "test"."Note" DROP COLUMN "status",
ADD COLUMN     "statusID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "test"."List" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "List_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "test"."Note" ADD CONSTRAINT "Note_statusID_fkey" FOREIGN KEY ("statusID") REFERENCES "test"."List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
