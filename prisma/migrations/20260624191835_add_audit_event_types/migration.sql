/*
  Warnings:

  - Added the required column `eventType` to the `ToolExecutionLog` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('TOOL_EXECUTION', 'PROMPT_INJECTION', 'APPROVAL_CREATED', 'APPROVAL_APPROVED', 'APPROVAL_REJECTED');

-- AlterTable
ALTER TABLE "ToolExecutionLog" ADD COLUMN     "eventType" "AuditEventType" NOT NULL;
