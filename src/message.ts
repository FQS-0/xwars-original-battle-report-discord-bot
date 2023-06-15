/**
 * Creating battle report messages
 *
 * Formats:
 *  - CreateTextMessage: detailed text report
 *  - CreateOneLineMEssage: short report that fits into one line
 */

import {
    AttachmentBuilder,
    EmbedBuilder,
    MessageCreateOptions,
    User,
} from "discord.js"
import { Data } from "./model/report/Data"
import { MpType, PartyEnum } from "./model/report/Enums"
import { Fleet } from "./model/report/Fleet"
import { createBarGraphImage } from "./lib/BarGraph"

/**
 * Formats a number to reduce characters needed to display it. Uses prefixes k and M. Rounds number to one or no decimal places.
 *
 * @param i number to format
 * @returns formated number
 */
function formatNumber(i: number) {
    let prefix = ""
    if (i > 1000000) {
        prefix = "M"
        i = i / 1000000
    } else if (i > 1000) {
        prefix = "k"
        i = i / 1000
    }

    if (i < 100) return `${(Math.round(i * 10) / 10).toLocaleString()}${prefix}`

    return `${Math.round(i).toLocaleString()}${prefix}`
}

/**
 * Creates a detailed text message
 *
 * @param data - data from the battle report
 * @param fleetData - fleet data from the battle report
 * @param finalReportUrl - Url of the anonymised battel report
 * @param user - name of the user who parsed the battle report
 * @returns the message in text format
 */
const createTextMessage = (
    data: Data,
    fleetData: Fleet[],
    finalReportUrl: string,
    user: string | User
): MessageCreateOptions => {
    const attackerMP = data
        .getMp(MpType.fighting, PartyEnum.attacker)
        .toFixed(1)
    const defenderMP = data
        .getMp(MpType.fighting, PartyEnum.defender)
        .toFixed(1)
    let resultResponse
    if (data.loot.info.atter_couldloot) {
        if (
            data.loot.values &&
            Object.values(data.loot.values).some((v) => v > 0)
        ) {
            resultResponse =
                "**Attacker won and looted " +
                data.loot.values
                    .values()
                    .map((v) => v && v.toLocaleString())
                    .join("/") +
                " resources! :tada:**"
        } else {
            resultResponse =
                "**Attacker won :tada: and looted nothing :face_holding_back_tears:!**"
        }
    } else {
        resultResponse = "**Defender won! :tada:**"
    }

    let fleetLostResponse = ""

    let defenderResponsePart
    if (data.getMp(MpType.fighting, PartyEnum.defender) == 0) {
        defenderResponsePart =
            "Defender was a chicken and didn't engage in the fight but also hasn't lost any units :chicken:."
    } else {
        const fightingMP = data.getMp(MpType.fighting, PartyEnum.defender)
        const survivedMP = data.getMp(MpType.surviving, PartyEnum.defender)
        const survivedMPPercent = ((survivedMP / fightingMP) * 100).toFixed(1)
        if (fightingMP > 0) {
            if (survivedMP / fightingMP >= 1) {
                defenderResponsePart = `Defender with their force of ${survivedMP.toFixed(
                    1
                )}mp got involved in a hefty battle but was able to strike back successfully without losing anything :tada:.`
            } else {
                defenderResponsePart = `Defender lost some units but ${survivedMP.toFixed(
                    1
                )}mp (${survivedMPPercent}%) survived :face_holding_back_tears:.`
            }
        } else {
            defenderResponsePart = `Defender lost all units (${fightingMP.toFixed(
                1
            )}mp) :sob:.`
        }
    }
    let attackerResponsePart
    const fightingMP = data.getMp(MpType.fighting, PartyEnum.attacker)
    const survivedMP = data.getMp(MpType.surviving, PartyEnum.attacker)
    const survivedMPPercent = ((survivedMP / fightingMP) * 100).toFixed(1)
    if (survivedMP > 0) {
        if (survivedMPPercent === "100.0") {
            attackerResponsePart = `Attacker lost nothing :confetti_ball:.`
        } else {
            attackerResponsePart = `Attacker lost some units but ${survivedMP.toFixed(
                1
            )}mp (${survivedMPPercent}%) survived :piñata:.`
        }
    } else {
        attackerResponsePart = `Attacker lost all units (${fightingMP.toFixed(
            1
        )}mp) :sob:.`
    }

    fleetLostResponse = `
        ${attackerResponsePart}
        ${defenderResponsePart}
                `

    const attackerAlliance = data.parties.attacker.planet.alliance
        ? "[" + data.parties.attacker.planet.alliance + "] "
        : ""
    const defenderAlliance = data.parties.defender.planet.alliance
        ? "[" + data.parties.defender.planet.alliance + "] "
        : ""
    return {
        content: `${user} shared a battle report: ${finalReportUrl}

**Attacker:** ${attackerAlliance}${
            data.parties.attacker.planet.user_alias
        } with **${data
            .getCount(MpType.fighting, PartyEnum.attacker)
            .toLocaleString()}** ships and **${attackerMP}mp** (${data
            .getAttack(MpType.fighting, PartyEnum.attacker)
            .toLocaleString()}/${data
            .getDefense(MpType.fighting, PartyEnum.attacker)
            .toLocaleString()})
**Defender:** ${defenderAlliance}${
            data.parties.defender.planet.user_alias
        } with **${data
            .getCount(MpType.fighting, PartyEnum.defender)
            .toLocaleString()}** ships/defense units and **${defenderMP}mp** (${data
            .getAttack(MpType.fighting, PartyEnum.defender)
            .toLocaleString()}/${data
            .getDefense(MpType.fighting, PartyEnum.defender)
            .toLocaleString()})
        ${fleetLostResponse}
        ${resultResponse}
        ${"-".repeat(100)}`,
    }
}

/**
 * Creates a short one-line message
 *
 * @param data - data from the battle report
 * @param finalReportUrl - Url of the anonymised battel report
 * @returns the message in embed format
 */
const createOneLineMessage = (
    data: Data,
    finalReportUrl: string
): MessageCreateOptions => {
    let attacker = data.parties.attacker.planet.user_alias
    let defender = data.parties.defender.planet.user_alias
    let loot = ""

    if (data.parties.attacker.planet.alliance)
        attacker = `[${data.parties.attacker.planet.alliance}] ${attacker}`

    if (data.parties.defender.planet.alliance)
        defender = `[${data.parties.defender.planet.alliance}] ${defender}`

    if (data.loot.info.atter_couldloot) {
        attacker = `**${attacker}**`
        const values = data.loot.values
        if (values && values.values().some((v) => v > 0)) {
            loot =
                " - " +
                values
                    .values()
                    .map((v) => formatNumber(v))
                    .join(" | ")
        }
    } else {
        defender = `**${defender}**`
    }

    const attLostMp = data.getMp(MpType.destroyed, PartyEnum.attacker)
    const attLost =
        data.getMp(MpType.destroyed, PartyEnum.attacker) /
        data.getMp(MpType.fighting, PartyEnum.attacker)
    if (attLostMp > 0)
        attacker = `${attacker} (-${formatNumber(attLostMp)} MP, ${Math.round(
            attLost * 100
        )}%)`
    const defLostMp = data.getMp(MpType.destroyed, PartyEnum.defender)
    const defLost =
        data.getMp(MpType.destroyed, PartyEnum.defender) /
        data.getMp(MpType.fighting, PartyEnum.defender)
    if (defLostMp > 0)
        defender = `${defender} (-${formatNumber(defLostMp)} MP, ${Math.round(
            defLost * 100
        )}%)`

    const embed = new EmbedBuilder().setDescription(
        `[Battle Report](${finalReportUrl}): ${attacker} vs ${defender}${loot}`
    )

    return { embeds: [embed] }
}

/**
 * Creates a embed message with attached bar graph image
 *
 * @param data - data from the battle report
 * @param finalReportUrl - Url of the anonymised battel report
 * @returns the message in embed format
 */
const createBarGraphMessage = (
    data: Data,
    finalReportUrl: string,
    user: string | User
): MessageCreateOptions => {
    const embed = new EmbedBuilder()
        .setTitle("Battle report")
        .setURL(finalReportUrl)
        .setTimestamp(data.time * 1000)

    if (typeof user == "string") {
        embed.setAuthor({ name: user })
    } else {
        embed.setAuthor({
            name: user.username,
            iconURL: user.avatarURL() || undefined,
        })
    }

    if (data.parties.attacker.planet.alliance != "")
        embed.addFields({
            name: "Attacker",
            value: `[${data.parties.attacker.planet.alliance}] ${data.parties.attacker.planet.user_alias}`,
            inline: true,
        })
    else
        embed.addFields({
            name: "Attacker",
            value: data.parties.attacker.planet.user_alias,
            inline: true,
        })

    {
        const count = data.ships.fightingShips.getCount(PartyEnum.attacker)
        const attack = data.ships.fightingShips.getAttack(PartyEnum.attacker)
        const defense = data.ships.fightingShips.getDefense(PartyEnum.attacker)
        const mp = data.ships.fightingShips.getMp(PartyEnum.attacker)

        embed.addFields({
            name: "Fleet",
            value: `${count} ships - ${formatNumber(mp)} MP\n${formatNumber(
                attack
            )} Att/ ${formatNumber(defense)} Def`,
            inline: true,
        })
    }
    {
        const count =
            data.ships.fightingShips.getCount(PartyEnum.attacker) -
            data.ships.survivingShips.getCount(PartyEnum.attacker)
        const attack =
            data.ships.fightingShips.getAttack(PartyEnum.attacker) -
            data.ships.survivingShips.getAttack(PartyEnum.attacker)
        const defense =
            data.ships.fightingShips.getDefense(PartyEnum.attacker) -
            data.ships.survivingShips.getDefense(PartyEnum.attacker)
        const mp =
            data.ships.fightingShips.getMp(PartyEnum.attacker) -
            data.ships.survivingShips.getMp(PartyEnum.attacker)
        const losses =
            1 -
            data.ships.survivingShips.getMp(PartyEnum.attacker) /
                data.ships.fightingShips.getMp(PartyEnum.attacker)

        if (mp > 0)
            embed.addFields({
                name: `Losses ${Math.round(losses * 100)} %`,
                value: `${count} ships - ${formatNumber(mp)} MP\n${formatNumber(
                    attack
                )} Att/ ${formatNumber(defense)} Def`,
                inline: true,
            })
    }

    embed.addFields({ name: "\u200B", value: "\u200B" })

    if (data.parties.defender.planet.alliance != "")
        embed.addFields({
            name: "Defender",
            value: `[${data.parties.defender.planet.alliance}] ${data.parties.defender.planet.user_alias}`,
            inline: true,
        })
    else
        embed.addFields({
            name: "Defender",
            value: data.parties.defender.planet.user_alias,
            inline: true,
        })

    {
        const count = data.ships.fightingShips.getCount(PartyEnum.defender)
        const attack = data.ships.fightingShips.getAttack(PartyEnum.defender)
        const defense = data.ships.fightingShips.getDefense(PartyEnum.defender)
        const mp = data.ships.fightingShips.getMp(PartyEnum.defender)

        embed.addFields({
            name: "Fleet",
            value: `${count} ships - ${formatNumber(mp)} MP\n${formatNumber(
                attack
            )} Att/ ${formatNumber(defense)} Def`,
            inline: true,
        })
    }
    {
        const count =
            data.ships.fightingShips.getCount(PartyEnum.defender) -
            data.ships.survivingShips.getCount(PartyEnum.defender)
        const attack =
            data.ships.fightingShips.getAttack(PartyEnum.defender) -
            data.ships.survivingShips.getAttack(PartyEnum.defender)
        const defense =
            data.ships.fightingShips.getDefense(PartyEnum.defender) -
            data.ships.survivingShips.getDefense(PartyEnum.defender)
        const mp =
            data.ships.fightingShips.getMp(PartyEnum.defender) -
            data.ships.survivingShips.getMp(PartyEnum.defender)
        const losses =
            1 -
            data.ships.survivingShips.getMp(PartyEnum.defender) /
                data.ships.fightingShips.getMp(PartyEnum.defender)

        if (mp > 0)
            embed.addFields({
                name: `Losses ${Math.round(losses * 100)} %`,
                value: `${count} ships - ${formatNumber(mp)} MP\n${formatNumber(
                    attack
                )} Att/ ${formatNumber(defense)} Def`,
                inline: true,
            })
    }

    if (data.loot.info.atter_couldloot) {
        if (data.loot.values && data.loot.values.values().some((v) => v > 0)) {
            embed.setDescription("Attacker wins!")
            embed.addFields({
                name: "Loot",
                value: data.loot.values
                    .values()
                    .map((v) => formatNumber(v))
                    .join(" | "),
            })
        } else {
            embed.setDescription("Attacker wins and loots nothing!")
        }
    } else {
        embed.setDescription("Defender wins!")
    }

    const image = createBarGraphImage(data)
    const file = new AttachmentBuilder(image, { name: "kb.png" })

    embed.setImage("attachment://kb.png")

    return { embeds: [embed], files: [file] }
}

/**
 * Creates a message according to format
 *
 * @param format - format of the message
 * @param data - data from the battle report
 * @param fleetData - fleet data from the battle report
 * @param finalReportUrl - Url of the anonymised battel report
 * @param user - name of the user who parsed the battle report
 * @returns the message in text format
 */
export const createMessage = (
    format: string,
    data: Data,
    fleetData: Fleet[],
    finalReportUrl: string,
    user: string | User
): MessageCreateOptions => {
    switch (format) {
        case "text":
            return createTextMessage(data, fleetData, finalReportUrl, user)
            break
        case "oneline":
            return createOneLineMessage(data, finalReportUrl)
            break
        case "bargraph":
            return createBarGraphMessage(data, finalReportUrl, user)
            break
        default:
            throw new Error("unknown format")
    }
}
