-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'APPROVER');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'APPROVED', 'DENIED');

-- CreateTable
CREATE TABLE "Employee" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccessRequest" (
    "id" TEXT NOT NULL,
    "requestorId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "decisionBy" TEXT,
    "decisionAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccessRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_email_key" ON "Employee"("email");

-- CreateIndex
CREATE INDEX "AccessRequest_requestorId_idx" ON "AccessRequest"("requestorId");

-- CreateIndex
CREATE INDEX "AccessRequest_subjectId_idx" ON "AccessRequest"("subjectId");

-- CreateIndex
CREATE INDEX "AccessRequest_status_idx" ON "AccessRequest"("status");

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_requestorId_fkey" FOREIGN KEY ("requestorId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccessRequest" ADD CONSTRAINT "AccessRequest_decisionBy_fkey" FOREIGN KEY ("decisionBy") REFERENCES "Employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;
