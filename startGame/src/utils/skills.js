// 平砍
export const attackAction = function (game, triggerInfo) {
    const { attackAim, onlyOnce } = triggerInfo
    if (this.curEvent.includes('attack') && this.curRender.curFrameImgIndex === 3) {
        if (computedDistance(this.position.x, this.position.y, attackAim.position.x, attackAim.position.y) < 70) {
            // 命中
            let direction = getFaceToDirection({
                x1: attackAim.position.x,
                y1: attackAim.position.y,
                x2: this.position.x,
                y2: this.position.y
            })
            attackAim.resetFrameInfo(`${direction}_hit`)
            attackAim.addFrameEndEvent(attackAim.recoverFrameInfo.bind(attackAim))
        } else {
            // 击空
        }
        // 执行攻击时机
        if (onlyOnce) {
            this.removeAction('attackAction')
        }
    }
}