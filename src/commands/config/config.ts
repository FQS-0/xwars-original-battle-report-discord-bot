/**
 * SlashCommand /config definition and execution
 *
 * Usage:
 *   /config default_format <type=user|bot> <format=text|oneline>
 *
 * Sets the default message format for reports parsed by user or bot. <format>
 * is optional. By omitting the format, the current setting will be returned.
 */

import { Command } from "../../command.js"

import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    PermissionFlagsBits,
    DiscordAPIError,
    DiscordjsError,
    DiscordjsErrorCodes,
    RESTJSONErrorCodes,
} from "discord.js"

import { GuildConfig } from "../../guild-config.js"

const builder = new SlashCommandBuilder()
builder
    .setName("config")
    .setDescription("Configure the report parser!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
        subcommand
            .setName("default_format")
            .setDescription("The default message format.")
            .addStringOption((option) =>
                option
                    .setName("type")
                    .setDescription("message type: user or bot")
                    .setRequired(true)
                    .addChoices(
                        { name: "user", value: "user" },
                        { name: "bot", value: "bot" }
                    )
            )
            .addStringOption((option) =>
                option
                    .setName("format")
                    .setDescription("message format: text or oneline")
                    .addChoices(
                        { name: "text", value: "text" },
                        { name: "oneline", value: "oneline" }
                    )
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("publish_push_reports")
            .setDescription(
                "Sets or gets whether or not the bot should publish push reports"
            )
            .addBooleanOption((option) =>
                option
                    .setName("value")
                    .setDescription(
                        "The value publish_push_reports will be set to"
                    )
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("report_channel")
            .setDescription(
                "Sets or gets the channel reports will be published in"
            )
            .addStringOption((option) =>
                option.setName("id").setDescription("the id of the channel")
            )
    )

const execute = async (interaction: ChatInputCommandInteraction) => {
    const subcommand = interaction.options.getSubcommand()
    const type = interaction.options.get("type")?.value?.toString()
    const format = interaction.options.get("format")?.value?.toString()
    const id = interaction.options.get("id")?.value?.toString()
    const value = interaction.options.get("value")?.value

    if (!interaction.guild) {
        throw new Error("no guild")
    }

    const config = await GuildConfig.forGuild(interaction.guild)
    try {
        switch (subcommand) {
            case "default_format":
                if (format) {
                    switch (type) {
                        case "user":
                            config.defaultFormatUser = format
                            break
                        case "bot":
                            config.defaultFormatBot = format
                            break
                        default:
                            throw new Error("unknown format")
                    }

                    interaction.reply({
                        content: `Default format for ${type} set to ${format}`,
                        ephemeral: true,
                    })
                } else {
                    //Return format
                    let format
                    switch (type) {
                        case "user":
                            format = config.defaultFormatUser
                            break
                        case "bot":
                            format = config.defaultFormatBot
                            break
                        default:
                            throw new Error("unknown format")
                    }

                    interaction.reply({
                        content: `Default format for ${type} is ${format}`,
                        ephemeral: true,
                    })
                }
                break
            case "publish_push_reports":
                if (value !== undefined) {
                    if (typeof value !== "boolean")
                        throw new Error("expected boolean value")
                    config.publishPushReports = value
                    interaction.reply({
                        content: `publish_push_records set to ${value}`,
                        ephemeral: true,
                    })
                } else {
                    interaction.reply({
                        content: `publish_push_records is ${config.publishPushReports}`,
                        ephemeral: true,
                    })
                }
                break
            case "report_channel":
                if (id !== undefined) {
                    const channel = await interaction.guild.channels.fetch(id)
                    if (channel !== null) {
                        config.reportChannel = id
                        interaction.reply({
                            content: `report_channel set to ${id} = ${channel}`,
                            ephemeral: true,
                        })
                    }
                } else {
                    const id = config.reportChannel
                    if (id !== null) {
                        const channel = await interaction.guild.channels.fetch(
                            id
                        )
                        if (channel !== null) {
                            interaction.reply({
                                content: `report_channel is ${id} = ${channel}`,
                                ephemeral: true,
                            })
                        }
                    } else {
                        interaction.reply({
                            content: `report_channel is not configured`,
                            ephemeral: true,
                        })
                    }
                }
                break
            default:
                interaction.reply({
                    content: `Unknown subcommand ${subcommand}`,
                    ephemeral: true,
                })
        }
    } catch (e) {
        if (
            (e instanceof DiscordAPIError &&
                e.code === RESTJSONErrorCodes.UnknownChannel) ||
            (e instanceof DiscordjsError &&
                e.code === DiscordjsErrorCodes.GuildChannelUnowned)
        ) {
            interaction.reply({
                content: `Error: no channel with this id exists on the guild.`,
                ephemeral: true,
            })
            return
        }
        throw e
    }
}

export const command = new Command(builder, execute)
