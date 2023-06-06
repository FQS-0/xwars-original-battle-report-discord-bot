const path = require('path')
const Canvas = require('canvas')

const createBattleReportImage = (data) => {
        const MAX_X = 400
    const MAX_Y = 200

    const canvas = Canvas.createCanvas(MAX_X, MAX_Y)
    const ctx = canvas.getContext('2d')

    function row(i) {
        return MAX_Y/10*i;
    }

    function center(str, y) {
        ctx.fillText(str, (MAX_X - ctx.measureText(str).width)/2, y-4)
    }

    function left(str, y) {
        ctx.fillText(str, 10, y-4)
    }

    function right(str, y) {
        ctx.fillText(str, MAX_X - 10 - ctx.measureText(str).width, y-4)
    }

    function bars_left(data, key1_1, key1_2, key2, key3, max, y) {
        let att = data[key1_1][key2][key3].at
        let def = data[key1_1][key2][key3].de
        let att_res = 0
        let def_res = 0

        if(data[key1_2][key2] && data[key1_2][key2][key3]) {
            att_res = data[key1_2][key2][key3].at
            def_res = data[key1_2][key2][key3].de
        }
        ctx.fillStyle = 'rgb(179, 179, 179)'
        ctx.fillRect(MAX_X/2-20, y-MAX_Y/10+4, -att/max*(MAX_X/2-30), 8)
        ctx.fillStyle = 'rgb(153, 153, 153)'
        ctx.fillRect(MAX_X/2-20, y-2, -def/max*(MAX_X/2-30), -8)
        ctx.fillStyle = 'rgb(255, 0, 0)'
        ctx.fillRect(MAX_X/2-20, y-MAX_Y/10+4, -att_res/max*(MAX_X/2-30), 8)
        ctx.fillStyle = 'rgb(202, 0, 0)'
        ctx.fillRect(MAX_X/2-20, y-2, -def_res/max*(MAX_X/2-30), -8)
    }

    function bars_right(data, key1_1, key1_2, key2, key3, max, y) {
        let att = data[key1_1][key2][key3].at
        let def = data[key1_1][key2][key3].de
        let att_res = 0
        let def_res = 0

        if(data[key1_2][key2] && data[key1_2][key2][key3]) {
            att_res = data[key1_2][key2][key3].at
            def_res = data[key1_2][key2][key3].de
        }

        ctx.fillStyle = 'rgb(179, 179, 179)'
        ctx.fillRect(MAX_X/2+20, y-MAX_Y/10+4, att/max*(MAX_X/2-30), 8)
        ctx.fillStyle = 'rgb(153, 153, 153)'
        ctx.fillRect(MAX_X/2+20, y-2, def/max*(MAX_X/2-30), -8)
        ctx.fillStyle = 'rgb(255, 0, 0)'
        ctx.fillRect(MAX_X/2+20, y-MAX_Y/10+4, att_res/max*(MAX_X/2-30), 8)
        ctx.fillStyle = 'rgb(202, 0, 0)'
        ctx.fillRect(MAX_X/2+20, y-2, def_res/max*(MAX_X/2-30), -8)
    }

    function font_big() {
        ctx.font = `${(MAX_Y/10-4)}px sans-serif`
    }

    function font_medium() {
        ctx.font = `${Math.floor((MAX_Y/10-8))}px sans-serif`
    }

    function font_small() {
        ctx.font = `${Math.floor((MAX_Y/10-4)/2)}px sans-serif`
    }

    function sum(data, key1, key2, key3) {
        let result = 0
        for(let i = 1; i <= 5; i++) {
            if(data[key1][key2] && data[key1][key2][i]) {
                result += data[key1][key2][i][key3]
            }
        }
        return result
    }

    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillRect(0, 0, MAX_X, MAX_Y)

    const logo = new Canvas.Image()
    logo.onload = () => {
        ctx.drawImage(logo, (MAX_X-logo.width)/2, row(2)-logo.height-5, logo.width, logo.height)
    }
    logo.src = path.join(__dirname, 'img', 'logo.png')

    font_medium()
    ctx.fillStyle = 'rgb(255, 255, 255)'
    center('T/P', row(4))
    center('L', row(5))
    center('M', row(6))
    center('H', row(7))

    font_medium()

    if(data.parties.attacker.planet.alliance) {
        left(`[${data.parties.attacker.planet.alliance}] ${data.parties.attacker.planet.user_alias}`, row(2))
    } else {
        left(data.parties.attacker.planet.user_alias, row(2))
    }

    if(data.parties.defender.planet.alliance) {
        right(`[${data.parties.defender.planet.alliance}] ${data.parties.defender.planet.user_alias}`, row(2))
    } else {
        right(data.parties.defender.planet.user_alias, row(2))
    }

    font_small()

    if(data.loot.info.atter_couldloot) {
        left('Attacker wins', row(1))
        right('Defender loses', row(1))
    } else {
        left('Attacker loses', row(1))
        right('Defender wins', row(1))
    }

    const max_a = [
        data.ships.g.att[1].at,
        data.ships.g.att[2].at,
        data.ships.g.att[3].at,
        data.ships.g.att[4].at,
        data.ships.g.att[5].at,
        data.ships.g.att[1].de,
        data.ships.g.att[2].de,
        data.ships.g.att[3].de,
        data.ships.g.att[4].de,
        data.ships.g.att[5].de,
        data.ships.g.def[1].at,
        data.ships.g.def[2].at,
        data.ships.g.def[3].at,
        data.ships.g.def[4].at,
        data.ships.g.def[5].at,
        data.ships.g.def[1].de,
        data.ships.g.def[2].de,
        data.ships.g.def[3].de,
        data.ships.g.def[4].de,
        data.ships.g.def[5].de
    ]

    const max = Math.max(...max_a)

    bars_left(data.ships, 'g', 'result', 'att', 1, max, row(5))
    bars_left(data.ships, 'g', 'result', 'att', 2, max, row(6))
    bars_left(data.ships, 'g', 'result', 'att', 3, max, row(7))
    bars_left(data.ships, 'g', 'result', 'att', 4, max, row(4))

    bars_right(data.ships, 'g', 'result', 'def', 1, max, row(5))
    bars_right(data.ships, 'g', 'result', 'def', 2, max, row(6))
    bars_right(data.ships, 'g', 'result', 'def', 3, max, row(7))
    bars_right(data.ships, 'g', 'result', 'def', 5, max, row(4))

    const mp_att = (sum(data.ships, 'g', 'att', 'at') + sum(data.ships, 'g', 'att', 'de'))/200
    const mp_att_res = (sum(data.ships, 'result', 'att', 'at') + sum(data.ships, 'result', 'att', 'de'))/200
    const mp_def = (sum(data.ships, 'g', 'def', 'at') + sum(data.ships, 'g', 'def', 'de'))/200
    const mp_def_res = (sum(data.ships, 'result', 'def', 'at') + sum(data.ships, 'result', 'def', 'de'))/200

    const mp_att_str = `${Math.round(mp_att_res)} / ${Math.round(mp_att)} MP (${Math.floor(mp_att_res/mp_att*100)}%)`
    const mp_def_str = `${Math.round(mp_def_res)} / ${Math.round(mp_def)} MP (${Math.floor(mp_def_res/mp_def*100)}%)`

    ctx.fillStyle = 'rgb(255, 255, 255)'
    font_small()

    ctx.fillText(mp_att_str, MAX_X/4-ctx.measureText(mp_att_str).width/2, row(8))
    ctx.fillText(mp_def_str, 3*MAX_X/4-ctx.measureText(mp_def_str).width/2, row(8))

    if(data.loot.info.atter_couldloot && data.loot.values) {
        ctx.fillText('Loot', MAX_X/10, row(9)-5)
        font_medium()
        for(let i = 0; i <= 5; i++) {
            ctx.fillText(data.loot.values[i], MAX_X/7*(i+1.5) - ctx.measureText(data.loot.values[i]).width, row(10)-5)
        }
    }

    return canvas.toBuffer('image/png')
}



module.exports = createBattleReportImage
