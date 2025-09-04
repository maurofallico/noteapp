-- DropForeignKey
ALTER TABLE "test"."Note" DROP CONSTRAINT "Note_listID_fkey";

-- AddForeignKey
ALTER TABLE "test"."Note" ADD CONSTRAINT "Note_listID_fkey" FOREIGN KEY ("listID") REFERENCES "test"."List"("id") ON DELETE CASCADE ON UPDATE CASCADE;
