-- CreateTable
CREATE TABLE "SeedRecord" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeedRecord_pkey" PRIMARY KEY ("id")
);
