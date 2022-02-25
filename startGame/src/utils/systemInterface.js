import { SYSTEM_INTERFACE_INFO_COMMON } from '../cq_data'
import { drawPolygon } from "./canvasTool"
import { getMainViewportPostion } from "./positionReset"
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

/**
 * draw extra interface info
 * @param arr [ [] json ] 
 *        initPosition [x, y]
 */
export const startDrawInfo = function({ ctx }, arr) {
    arr.forEach(eachExtraInfoPart => {
        handleEachInfoPart({ ctx }, eachExtraInfoPart)
    })

}

const handleEachInfoPart = ({ ctx }, eachExtraInfoPart, parent) => {
    eachExtraInfoPart.forEach(item => {
        // 如果没有init origin无法渲染直接拦截, fix定位也要加上initOrigin, [0,0]
        handleInitOrigin(item, parent)
        // get canvas position 计算canvas中的真实位置 { x, y }
        item.canvasOrigin = getMainViewportPostion({ x: item.initOrigin()[0], y: item.initOrigin()[1] })
        // 要渲染的初始位置的canvas相对位置
        switch (item.modal) {
            case 'div':
                drawDiv({ ctx }, item, parent)
                break;
            case 'font':
                drawFonts({ ctx }, item, parent)
                break;
            case 'img':
                drawFonts({ ctx }, item, parent)
                break;
            case 'hp':
                drawHp({ ctx }, item, parent)
                break;
        }
        if (item.child) {
            handleEachInfoPart({ ctx }, item.child, item)
        }
    })
}

const drawDiv = ({ ctx }, item, parent) => {
    handleBorder({ ctx }, item)
}

const drawFonts = ({ ctx }, item, parent) => {
    let { fontSize = 12, letterSpacing = 1, lineHeight } = item.layoutInfo
    if (!lineHeight) { lineHeight = (item.layoutInfo.fontSize || 12) }
    const fontsNumber = (item.content && item.content.length || 0)
    
    if (item.position === 'alignCenter') {
        item.layoutInfo.width = getFontSizeWidth(item.content, item.layoutInfo.fontSize || 12, item.layoutInfo.letterSpacing || 0)
        item.layoutInfo.height = lineHeight + (letterSpacing * 2)
        const { top = 0, height = 0 } = item.layoutInfo
        let paddingLeft = (parent.layoutInfo.width - item.layoutInfo.width) / 2
        let startOrigin =  [parent.canvasOrigin.x + paddingLeft, parent.canvasOrigin.y + top]
        // let startOrigin =  [parent.canvasOrigin.x, parent.canvasOrigin.y]
        typewriting({ ctx }, startOrigin, item.content, { letterSpacing, lineHeight, fontSize, ...item.layoutInfo })
    }
}

const drawHp = ({ ctx }, item, parent) => {
    let { width, height, fontSize = 12, fontFamily = '' } = item.layoutInfo;
    let { x, y } = parent.canvasOrigin;
    let { hp, maxHp } = item.content || item.getContent()
    let hpWidth = width * ((hp || 0) / maxHp)
    if (hpWidth < 0) { hpWidth = 0 }
    ctx.beginPath();
    ctx.strokeStyle = 'red'
    ctx.moveTo(x,y + (height / 2));
    ctx.lineTo(x + hpWidth,y + (height / 2));
    ctx.lineWidth = height;
    ctx.stroke();

    ctx.direction = 'ltr'
    ctx.fillStyle = '#FFF'
    ctx.font = `${fontSize}px  ${fontFamily || 'Arial'}`
    ctx.fillText(`${hp}/${maxHp}`, x + width + 2, y + height)
}

const computedFontWidthAndHeight = () => {

}

const handleWithPosition = (item) => {
    switch(item.position) {
        case 'alignCenter':
        default: () => {}
    }
}

const typewriting = ({ ctx }, startOrigin, fonts, { letterSpacing, lineHeight, fontSize, fontFamily = '' }) => {
    const fontArrList = fonts.split("")
    let curPoint = startOrigin
    // console.log("============curPoint=======")
    let _offsetTop = fontSize 
    let _offsetLeft = letterSpacing
    // ctx.save();
    ctx.font = `${fontSize}px  ${fontFamily || 'Arial'}`
    ctx.fillStyle = '#FFF'
    ctx.direction = 'rtl'
    
    while(fontArrList.length) {
       const curFont = fontArrList.shift()
       let fontWidth = getFontSizeWidth(curFont, fontSize)
       ctx.fillText(curFont, curPoint[0] + _offsetLeft + fontWidth, curPoint[1] + _offsetTop)
       curPoint[0] += (letterSpacing * 2 + fontWidth)
    }
    // ctx.restore();
}

const handleInitOrigin = (item, parent) => {
    // 如果子元素没有初始化的位置 那么继承父元素的初始化位置
    if (!item.initOrigin) {
        if (!parent.initOrigin) return false
        item.initOrigin = parent.initOrigin
    }
}

const handleBorder = ({ ctx }, item) => {
    if (item.borderStyle && item.borderStyle.width) {
        const { width, height, left, top } = item.layoutInfo
        const { x, y } = item.canvasOrigin
        const p0 = [ x + left, y + top]
        const p1 = [ x + left, y + top + height]
        const p2 = [ x + left + width, y + top + height]
        const p3 = [ x + left + width, y + top ]
        let points = [...p0, ...p1, ...p2, ...p3]
        drawPolygon({ ctx, width: item.borderStyle.width, color: item.borderStyle.color }, points)
    }
}

const getFontSizeWidth = (string, fontSize, letterSpacing) => {
    // |-[  ]-|    ::   - letterSpacing [ ] font-size
    let stringLength = string.length
    let semiangleArr = string.match(/[\u0000-\u00ff]/g)
    if (stringLength === 1) {
        // only one word , return the word real bulk
        return semiangleArr && semiangleArr.length ? fontSize / 2 : fontSize
    } else {
        // a string , return sum width 
        return  semiangleArr.length * ((fontSize / 2) + letterSpacing) + (stringLength - semiangleArr.length) * (fontSize + letterSpacing)
    }
}