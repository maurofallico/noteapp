/*
  Warnings:

  - You are about to drop the column `statusID` on the `Note` table. All the data in the column will be lost.
  - Added the required column `userID` to the `List` table without a default value. This is not possible if the table is not empty.
  - Added the required column `listID` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "test"."Note" DROP CONSTRAINT "Note_statusID_fkey";

-- AlterTable
ALTER TABLE "test"."List" ADD COLUMN     "userID" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "test"."Note" DROP COLUMN "statusID",
ADD COLUMN     "listID" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "test"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "test"."Note" ADD CONSTRAINT "Note_listID_fkey" FOREIGN KEY ("listID") REFERENCES "test"."List"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test"."List" ADD CONSTRAINT "List_userID_fkey" FOREIGN KEY ("userID") REFERENCES "test"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
