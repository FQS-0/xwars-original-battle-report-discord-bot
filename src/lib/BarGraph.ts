/** Bar graph image generation */
import * as canvas from "canvas"
import { Data } from "../model/report/Data"
import { MpType, PartyEnum, ShipClassEnum } from "../model/report/Enums"

const MAX_X = 400
const MAX_Y = 100
const NUM_ROWS = 5
const ROW_HEIGHT = MAX_Y / NUM_ROWS
const TEXT_SIZE = 0.8
const TEXT_HEIGHT = ROW_HEIGHT * TEXT_SIZE

try {
    canvas.registerFont("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", {
        family: "Dejavu Sans",
    })
} catch(e) {
    console.log('Failed to register font file')
}

/** 
 * Creates a bar graph image from report json data and returns the buffer containing the image
 * @param data - json report data
 * @returns Buffer containing the bar graph image
 */
export const createBarGraphImage = (data: Data) => {
    const cnvs = canvas.createCanvas(MAX_X, MAX_Y)
    const ctx = cnvs.getContext("2d")

    const maxAttDef = Math.max(
        data.getAttack(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.light
        ),
        data.getAttack(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.medium
        ),
        data.getAttack(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.heavy
        ),
        data.getAttack(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.tactical
        ),
        data.getAttack(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.orbital
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.light
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.medium
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.heavy
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.tactical
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.orbital
        ),
        data.getAttack(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.light
        ),
        data.getAttack(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.medium
        ),
        data.getAttack(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.heavy
        ),
        data.getAttack(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.tactical
        ),
        data.getAttack(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.orbital
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.light
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.medium
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.heavy
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.tactical
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.orbital
        )
    )

    const row = (i: number) => {
        return ROW_HEIGHT * i
    }

    const drawTextCentered = (text: string, y: number) => {
        ctx.fillText(
            text,
            (MAX_X - ctx.measureText(text).width) / 2,
            y - (ROW_HEIGHT - TEXT_HEIGHT)
        )
    }

    const drawBarsLeft = (
        attFighting: number,
        defFighting: number,
        attSurviving: number,
        defSurviving: number,
        y: number
    ) => {
        ctx.fillStyle = "rgb(179, 179, 179)"
        ctx.fillRect(
            MAX_X / 2 - 20,
            y - ROW_HEIGHT * 0.5,
            (-attFighting / maxAttDef) * (MAX_X / 2 - 30),
            -ROW_HEIGHT * 0.5 * 0.8
        )
        ctx.fillStyle = "rgb(153, 153, 153)"
        ctx.fillRect(
            MAX_X / 2 - 20,
            y - ROW_HEIGHT * 0.5,
            (-defFighting / maxAttDef) * (MAX_X / 2 - 30),
            ROW_HEIGHT * 0.5 * 0.8
        )
        ctx.fillStyle = "rgb(255, 0, 0)"
        ctx.fillRect(
            MAX_X / 2 - 20,
            y - ROW_HEIGHT * 0.5,
            (-attSurviving / maxAttDef) * (MAX_X / 2 - 30),
            -ROW_HEIGHT * 0.5 * 0.8
        )
        ctx.fillStyle = "rgb(202, 0, 0)"
        ctx.fillRect(
            MAX_X / 2 - 20,
            y - ROW_HEIGHT * 0.5,
            (-defSurviving / maxAttDef) * (MAX_X / 2 - 30),
            ROW_HEIGHT * 0.5 * 0.8
        )
    }

    const drawBarsRight = (
        attFighting: number,
        defFighting: number,
        attSurviving: number,
        defSurviving: number,
        y: number
    ) => {
        ctx.fillStyle = "rgb(179, 179, 179)"
        ctx.fillRect(
            MAX_X / 2 + 20,
            y - ROW_HEIGHT * 0.5,
            (attFighting / maxAttDef) * (MAX_X / 2 - 30),
            -ROW_HEIGHT * 0.5 * 0.8
        )
        ctx.fillStyle = "rgb(153, 153, 153)"
        ctx.fillRect(
            MAX_X / 2 + 20,
            y - ROW_HEIGHT * 0.5,
            (defFighting / maxAttDef) * (MAX_X / 2 - 30),
            ROW_HEIGHT * 0.5 * 0.8
        )
        ctx.fillStyle = "rgb(255, 0, 0)"
        ctx.fillRect(
            MAX_X / 2 + 20,
            y - ROW_HEIGHT * 0.5,
            (attSurviving / maxAttDef) * (MAX_X / 2 - 30),
            -ROW_HEIGHT * 0.5 * 0.8
        )
        ctx.fillStyle = "rgb(202, 0, 0)"
        ctx.fillRect(
            MAX_X / 2 + 20,
            y - ROW_HEIGHT * 0.5,
            (defSurviving / maxAttDef) * (MAX_X / 2 - 30),
            ROW_HEIGHT * 0.5 * 0.8
        )
    }

    ctx.font = `${Math.floor(TEXT_HEIGHT)}px "Dejavu Sans"`

    // Paint canvas black
    //ctx.fillStyle = "rgb(0, 0, 0)"
    //ctx.fillRect(0, 0, MAX_X, MAX_Y)

    ctx.fillStyle = "rgb(255, 255, 255)"
    drawTextCentered("T", row(1))
    drawTextCentered("L", row(2))
    drawTextCentered("M", row(3))
    drawTextCentered("H", row(4))
    drawTextCentered("O", row(5))

    drawBarsLeft(
        data.getAttack(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.tactical
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.tactical
        ),
        data.getAttack(
            MpType.surviving,
            PartyEnum.attacker,
            ShipClassEnum.tactical
        ),
        data.getDefense(
            MpType.surviving,
            PartyEnum.attacker,
            ShipClassEnum.tactical
        ),
        row(1)
    )
    drawBarsLeft(
        data.getAttack(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.light
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.light
        ),
        data.getAttack(
            MpType.surviving,
            PartyEnum.attacker,
            ShipClassEnum.light
        ),
        data.getDefense(
            MpType.surviving,
            PartyEnum.attacker,
            ShipClassEnum.light
        ),
        row(2)
    )
    drawBarsLeft(
        data.getAttack(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.medium
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.medium
        ),
        data.getAttack(
            MpType.surviving,
            PartyEnum.attacker,
            ShipClassEnum.medium
        ),
        data.getDefense(
            MpType.surviving,
            PartyEnum.attacker,
            ShipClassEnum.medium
        ),
        row(3)
    )
    drawBarsLeft(
        data.getAttack(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.heavy
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.attacker,
            ShipClassEnum.heavy
        ),
        data.getAttack(
            MpType.surviving,
            PartyEnum.attacker,
            ShipClassEnum.heavy
        ),
        data.getDefense(
            MpType.surviving,
            PartyEnum.attacker,
            ShipClassEnum.heavy
        ),
        row(4)
    )

    drawBarsRight(
        data.getAttack(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.tactical
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.tactical
        ),
        data.getAttack(
            MpType.surviving,
            PartyEnum.defender,
            ShipClassEnum.tactical
        ),
        data.getDefense(
            MpType.surviving,
            PartyEnum.defender,
            ShipClassEnum.tactical
        ),
        row(1)
    )
    drawBarsRight(
        data.getAttack(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.light
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.light
        ),
        data.getAttack(
            MpType.surviving,
            PartyEnum.defender,
            ShipClassEnum.light
        ),
        data.getDefense(
            MpType.surviving,
            PartyEnum.defender,
            ShipClassEnum.light
        ),
        row(2)
    )
    drawBarsRight(
        data.getAttack(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.medium
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.medium
        ),
        data.getAttack(
            MpType.surviving,
            PartyEnum.defender,
            ShipClassEnum.medium
        ),
        data.getDefense(
            MpType.surviving,
            PartyEnum.defender,
            ShipClassEnum.medium
        ),
        row(3)
    )
    drawBarsRight(
        data.getAttack(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.heavy
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.heavy
        ),
        data.getAttack(
            MpType.surviving,
            PartyEnum.defender,
            ShipClassEnum.heavy
        ),
        data.getDefense(
            MpType.surviving,
            PartyEnum.defender,
            ShipClassEnum.heavy
        ),
        row(4)
    )
    drawBarsRight(
        data.getAttack(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.orbital
        ),
        data.getDefense(
            MpType.fighting,
            PartyEnum.defender,
            ShipClassEnum.orbital
        ),
        data.getAttack(
            MpType.surviving,
            PartyEnum.defender,
            ShipClassEnum.orbital
        ),
        data.getDefense(
            MpType.surviving,
            PartyEnum.defender,
            ShipClassEnum.orbital
        ),
        row(5)
    )

    return cnvs.toBuffer("image/png")
}
