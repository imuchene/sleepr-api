-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "invoiceId" TEXT NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);
