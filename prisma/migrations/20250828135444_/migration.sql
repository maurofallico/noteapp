-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "test";

-- CreateTable
CREATE TABLE "test"."Note" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT[],
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);
