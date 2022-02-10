import { SYSTEM_INTERFACE_INFO_COMMON } from '../cq_data'
// draw systemInterface
export const drawBloodAndMagic = function ({ ctx, game }) {
    // draw blood and magic
    const heroItem = game.heroList.filter(v => v.state.isHero)[0]
    if (heroItem) {
        const maxHp = heroItem.state.maxHp
        const hp = heroItem.state.hp
        Object.keys(SYSTEM_INTERFACE_INFO_COMMON).forEach(key => {
            const waitForDrawInfo = SYSTEM_INTERFACE_INFO_COMMON[key]
            if (key === 'HP_INFO') {
                if (hp >= 0) {
                    const reduce = ((maxHp - hp) / maxHp)
                    const reduceDisdances = (waitForDrawInfo.IMG_HEIGHT - (waitForDrawInfo.PADDING_TOP + waitForDrawInfo.PADDING_BOTTOM)) * reduce + waitForDrawInfo.PADDING_TOP
                    waitForDrawInfo.IMG_HEIGHT_FROM = reduceDisdances 
                    waitForDrawInfo._top = waitForDrawInfo.TOP + reduceDisdances *(waitForDrawInfo.HEIGHT / waitForDrawInfo.IMG_HEIGHT)
                }
            }
            game.waitForDrawSysInterfaceList.push(waitForDrawInfo)
        })
    }
}

export const handleDrawInterface = function ({ ctx, game }) {
    game.waitForDrawSysInterfaceList = []
    drawBloodAndMagic({ ctx, game })

    startDrawSysInfo({ ctx, game })
}

const startDrawSysInfo = function ({ ctx, game }) {
    game.waitForDrawSysInterfaceList.forEach(drawInfoItem => {
        // handle default value
        const { IMG_WIDTH, IMG_WIDTH_FROM, IMG_HEIGHT_FROM, IMG_HEIGHT, WIDTH, _width, HEIGHT, _height, LEFT, _left, TOP, _top, FRAME_STAY, FRAME_TIME } = drawInfoItem
        if (!drawInfoItem.curRender) {
            drawInfoItem.curRender = {
                curFrame: 0,
                curFrameIndex: 0,
            }
        }
        const Img = FRAME_STAY ? window.resources[drawInfoItem.IMG(drawInfoItem.curRender.curFrameIndex)] : window.resources[drawInfoItem.IMG()]
        if (FRAME_STAY) {
            if (drawInfoItem.curRender.curFrame === FRAME_STAY) { // change next page
                drawInfoItem.curRender.curFrameIndex++
                drawInfoItem.curRender.curFrame = 0
                if (drawInfoItem.curRender.curFrameIndex === FRAME_TIME) {
                    drawInfoItem.curRender.curFrameIndex = 0 // 播放完一个循环,重新开始
                }
            } else {
                drawInfoItem.curRender.curFrame++
            }
        }
        ctx.drawImage(Img, IMG_WIDTH_FROM || 0, IMG_HEIGHT_FROM || 0, IMG_WIDTH, IMG_HEIGHT, _left || LEFT, _top || TOP, _width || WIDTH, _height || HEIGHT)

    })
}