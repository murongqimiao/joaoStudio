/**
 * 初始化viewport的尺寸 (canvas的)
 */
export const reset_main_viewport = function () {

}

export const reset_map_position = function () {

}

export const initCanvasWidthMainViewportInfo = function () {
    const { cavnasId, height, width  } = this.mainViewportPosition
    const _canvas = document.getElementById(cavnasId)
    _canvas.width = width
    _canvas.height = height
    return this
}

/**
 * 通过主视口距离地图左上角的位置来计算相对于视口的坐标
 */
export const getMainViewportPostion = function (position) {
    const { leftDistances, topDistances, scale } = window.__game.mainViewportPosition
    // 坐标回归计算需要扣除canvas距离map左上角的leftDistances和topDistances
    return  { x: position.x - leftDistances, y: position.y - topDistances }
}

/**
 * computed walk event
 */
export const moveViewportWhenHeroWalk = function (position) {
    if (!position) return
    const { x, y } = position
    const { leftDistances, topDistances, width, height, marginLeft, marginRight, marginTop, marginBottom, scale  } = window.__game.mainViewportPosition
    if (leftDistances + marginLeft > x) { // left
        window.__game.mainViewportPosition.leftDistances = x - marginLeft
    }
    if (leftDistances + width - marginRight < x) { // right
        window.__game.mainViewportPosition.leftDistances = x + marginRight - width
    }
    if (topDistances + marginTop > y) { // top
        window.__game.mainViewportPosition.topDistances = y - marginTop
    }
    if (topDistances + height - marginBottom < y) {
        window.__game.mainViewportPosition.topDistances = y + marginTop - height
    }
}