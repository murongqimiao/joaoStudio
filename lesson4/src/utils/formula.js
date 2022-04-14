/**
 * 重力影响下的跳跃位置偏移量计算
 * @param {*} currentFrame 
 * @param {*} totalTime 单位是秒
 *   两个阶段 上升阶段和下落阶段, 上升阶段和下降阶段由于只受重力影响, 时间是相同的, t_up + t_down = totalTime t_up === t_down
 * | |
 * | |
 * | |
 * | |
 */
export const jumpHeightVariationByGravity = (currentFrame, totalTime) => {
    const g = window.__game.gameG
    const halfTime = (1/2) * totalTime
    const maxHeight = Math.round(1/2 * g * halfTime * halfTime)
    const currentTime = currentFrame * 1 / window.__game.gameFPS
    const absTime = Math.abs(halfTime - currentTime)
    return maxHeight - ((1/2) * g * absTime * absTime)
}

/**
 * 重力影响下的自由落体
 * @param {*} currentFrame
 * @returns  {number} 当前距离初始点的偏移量
 */
export const freeFalling = (currentFrame) => {
    const g = window.__game.gameG
    let currentTime = currentFrame *  1 / window.__game.gameFPS
    if (currentTime > 120) {
        currentTime = 120 // 限制一个最大速度
    }
    const currentVariationOfY = 1/2 * g * currentTime * currentTime
    return currentVariationOfY
}