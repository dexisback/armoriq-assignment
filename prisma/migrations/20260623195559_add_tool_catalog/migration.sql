-- CreateTable
CREATE TABLE "ToolCatalog" (
    "id" TEXT NOT NULL,
    "toolName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "inferredRisk" "RiskLevel" NOT NULL,
    "finalRisk" "RiskLevel" NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ToolCatalog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ToolCatalog_toolName_key" ON "ToolCatalog"("toolName");
