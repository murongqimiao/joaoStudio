import { jumpHeightVariationByGravity } from "../utils/formula"
/**
 * 角色相关事件
 */

/**
 * action info {}
 * 
 */
 export const mainRole = function (game) {
    const { spd } = this.state;
    const oldPosition = JSON.parse(JSON.stringify(this.position)) // 涉及到移动优先存储老位置
    let newEvent = ''
    let direction = this.curEvent.split("_")[0]
    let computedKeyList = JSON.parse(JSON.stringify(game.keyCollect))
    let computedKeyListBuffer = JSON.parse(JSON.stringify(game.keyCollectBuffer))
    const check = (list) => {
        return list.map(v => computedKeyList.includes(v)).every(v => v)
    }
    const hasInBuffer = (list) => {
        return list.map(v => computedKeyListBuffer.includes(v)).some(v => v)
    }
    /** 全部需要持续计算的状态放置在此处 **/
    // 判断跳跃状态, 跳跃是一个持续状态,在其他event中也要计算高度变化量
    if(this.curRender.jumping) {
        // 正在跳跃需要计算偏移量
        const positionYVaraition = jumpHeightVariationByGravity(this.curRender.jumpFrame, this.state.jumpDuration)
        this.addPosition(Object.assign(oldPosition, { y: this.position.y - positionYVaraition }))
        if (this.curRender.jumpFrame >= this.curRender.jumpMaxFrame) {
            this.curRender.jumping = false
            this.curRender.curFrameImgIndex = 0
            this.curRender.curFrame = 0
            this.curEvent = direction + '_stand'
        }
        this.curRender.jumpFrame++
        this.position.y =  this.curRender.jumpInitPositionY - positionYVaraition
    }
    /** 结束 **/

    if (computedKeyList.includes('J') && computedKeyList.includes('L')) {
        // 左右同时按住等于相互抵消
        ['J', 'L'].forEach(key => computedKeyList.splice(computedKeyList.indexOf(key)))
    } else if (computedKeyList.includes('I') && computedKeyList.includes('K')) {
        // 上下同时按住等于相互抵消
        ['I', 'K'].forEach(key => computedKeyList.splice(computedKeyList.indexOf(key)))
    }

    // 检测当前活跃按键
    if (computedKeyList.length) {
        if (check(['J'])) {
            // direct = 'TOP_LEFT' + (hasInBuffer(['J', 'I']) ? '_RUN' : '') 连续双击左
            newEvent = '6_run'
        }
        if (check(['L'])) {
            newEvent = '2_run'
        }
        if (check(['C'])) {
            // 跳跃独立计算位置
            newEvent = direction + '_jump'
        }
        if (check(['X'])) {
            newEvent = direction + '_attack'
        }
        if (check(['K'])) {
            if (!this.curRender.jumping) {
                // 只有非跳跃状态才能下蹲
                newEvent =  direction + '_down' 
            }
        }
    }

    this.oldEvent = this.curEvent
    if (newEvent && newEvent !== this.curEvent) {
        // 更换动作需要初始化的帧动画
        this.curRender.curFrameImgIndex = 0
        this.curRender.curFrame = 0
        this.curEvent = newEvent
    }

    // 横轴移动的位移量
    let variation = spd / Math.round(game.gameFPS / 60)

    // 出现新的行为进行切换
    switch (newEvent) {
        case '2_jump':
        case '6_jump':
            if (this.oldEvent && ['2_run','6_run','2_stand', '6_stand'].includes(this.oldEvent)) {
                // 当切换行为时才需要执行跳转行为
                if (this.state.jumpTime > 0) {
                    this.curRender.jumping = true
                    this.curRender.jumpTime--
                    this.curRender.jumpFrame = 0
                    this.curRender.jumpMaxFrame = Math.round(this.state.jumpDuration * game.gameFPS)
                    this.curRender.jumpInitPositionY = this.position.y // 记录当前position 用来做参照
                }
            }
            
            if (check(['L', 'J'])) {
            } else if (check(['L'])) {
                this.addPosition(Object.assign(oldPosition, { x: this.position.x + variation, y: this.position.y }))
            } else if (check(['J'])) {
                this.addPosition(Object.assign(oldPosition, { x: this.position.x - variation, y: this.position.y }))
            }
          
            break;
        case '6_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x - variation, y: this.position.y }))
            if (this.curRender.jumping) { this.curEvent = '6_jump' }
            break
        case '2_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x + variation, y: this.position.y }))
            if (this.curRender.jumping) { this.curEvent = '2_jump' }
            break

        case '2_attack':
        case '6_attack':
            if (check(['L', 'J'])) {
            } else if (check(['L'])) {
                this.addPosition(Object.assign(oldPosition, { x: this.position.x + variation, y: this.position.y }))
            } else if (check(['J'])) {
                this.addPosition(Object.assign(oldPosition, { x: this.position.x - variation, y: this.position.y }))
            }
            break;
        case '2_down':
        case '6_down':
            break;
        default:
            if (this.curEvent !== direction + '_stand') { // 恢复到兜底状态也需要重置图像的帧数
                if (this.curRender.jumping) return
                this.curRender.curFrameImgIndex = 0
                this.curRender.curFrame = 0
                this.curEvent = direction + '_stand'
            }
    }


    return this;
}