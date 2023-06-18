-- CreateTable
CREATE TABLE "GuildConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "default_format_user" TEXT NOT NULL,
    "default_format_bot" TEXT NOT NULL,
    "report_channel_id" TEXT,
    "publish_push_reports" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE INDEX "GuildConfig_id_idx" ON "GuildConfig"("id");
