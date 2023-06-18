/**
 * sqlite storage for guild configuration
 * @module
 */

import { PrismaClient, GuildConfig as GuildConfigPrisma } from "@prisma/client"

import { Guild, Snowflake } from "discord.js"

const db = new PrismaClient()

export class GuildConfig {
    private data: GuildConfigPrisma

    private constructor(data: GuildConfigPrisma) {
        this.data = data
    }

    static async forGuild(guild: Guild) {
        let data = await db.guildConfig.findUnique({ where: { id: guild.id } })

        if (!data) {
            data = await db.guildConfig.create({
                data: {
                    id: guild.id,
                    default_format_user: "text",
                    default_format_bot: "text",
                    publish_push_reports: true,
                },
            })
        }

        return new this(data)
    }

    get defaultFormatUser(): string {
        return this.data.default_format_user
    }

    set defaultFormatUser(format: string) {
        db.guildConfig.update({
            data: { default_format_user: format },
            where: { id: this.data.id },
        }).then((data) => this.data = data)
    }

    get defaultFormatBot(): string {
        return this.data.default_format_bot
    }

    set defaultFormatBot(format: string) {
        db.guildConfig.update({
            data: { default_format_bot: format },
            where: { id: this.data.id },
        }).then((data) => this.data = data)
    }

    get reportChannel(): Snowflake | null {
        return this.data.report_channel_id
    }

    set reportChannel(id: Snowflake) {
        db.guildConfig.update({
            data: { report_channel_id: id },
            where: { id: this.data.id },
        }).then((data) => this.data = data)
    }

    get publishPushReports(): boolean {
        return this.data.publish_push_reports
    }

    set publishPushReports(publish: boolean) {
        db.guildConfig.update({
            data: { publish_push_reports: publish },
            where: { id: this.data.id },
        }).then((data) => this.data = data)
    }
}
