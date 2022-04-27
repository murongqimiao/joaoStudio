import { jumpHeightVariationByGravity } from "../utils/formula"
import { checkMapRemora } from "../utils/drawMap"
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
        this.curRender.jumpFrame++
        this.position.y =  this.curRender.jumpInitPositionY - positionYVaraition
    }
    /** 结束 **/

    // 过滤部分行为
    if (computedKeyList.includes('X') && !this.curRender.jumping) {
        // 摁住攻击键忽略移动, 既攻击行为为第一优先级
        computedKeyList = computedKeyList.filter(v => !['J', 'L'].includes(v))
    }
    if (computedKeyList.includes('J') && computedKeyList.includes('L')) {
        // 左右同时按住等于相互抵消
        ['J', 'L'].forEach(key => computedKeyList.splice(computedKeyList.indexOf(key)))
    }
    if (computedKeyList.includes('I') && computedKeyList.includes('K')) {
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

    // 考虑重力影响
    const obstacle = window.__game.mapInfo.obstacle
    let _checkMapRemora = checkMapRemora.bind(this)
    _checkMapRemora(obstacle,
        this,
        () => {
            // 发生了碰撞
            if (this.curRender.jumping && ((this.curRender.jumpFrame * 2) <= (this.state.jumpDuration * game.gameFPS))) {
                console.log("======跳跃上半段======")
            } else if (this.curRender.jumping && ((this.curRender.jumpFrame * 2) > (this.state.jumpDuration * game.gameFPS))) {
                console.log("======跳跃下半段====")
                this.curRender.jumping = false
                this.curRender.curFrameImgIndex = 0
                this.curRender.curFrame = 0
                this.curEvent = direction + '_stand'
            }
            this.curRender.needDrop = false
        },
        () => {
            // console.log("没有碰撞到障碍物, 需要掉落")
            this.curRender.needDrop = true
            // 开启跳跃
            if (!this.curRender.jumping) {
                this.curRender.jumping = true
                this.curRender.curEvent = direction + '_jump'
                this.curRender.jumpTime--
                this.curRender.curFrame = 0
                this.curRender.curFrameImgIndex = 0
                this.curRender.jumpFrame = Math.round(this.state.jumpDuration * game.gameFPS / 2)
                this.curRender.jumpInitPositionY = this.position.y + Math.round(1/2 * game.gameG * Math.pow(this.state.jumpDuration / 2, 2))
                console.log("=======jumpInitPositionY111=========", this.curRender.jumpInitPositionY)
                console.log(this.curRender.jumpFrame)
            }
        },
        {
            variationY: 4 // config
        }
    )



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
        case '2_run':
            let right = direction == '2' ? 1 : -1 // 移动方向是否往右
            let variationX = variation * right
            let variationY = variation * 0.68 // 上坡下坡斜率在0.6左右
            if (this.curRender.jumping) {
                this.addPosition(Object.assign(oldPosition, { x: this.position.x + variationX, y: this.position.y }))
            } else if (_checkMapRemora(obstacle, this,() => {}, () => {}, { variationX, variationY: variationY }).every(v => v)) { // 先检测是否可以向下走
                this.addPosition(Object.assign(oldPosition, { x: this.position.x + variationX, y: this.position.y + variationY }))
            } else if (_checkMapRemora(obstacle, this,() => {}, () => {}, { variationX }).every(v => v)) {
                // 检测平着走
                this.addPosition(Object.assign(oldPosition, { x: this.position.x + variationX, y: this.position.y }))
            } else if (_checkMapRemora(obstacle, this,() => {}, () => {}, { variationX, variationY: (-1 * variationY) }).every(v => v)) {
                // 检测是否可以往上方走
                this.addPosition(Object.assign(oldPosition, { x: this.position.x + variationX, y: this.position.y + (-1 * variationY) }))
            }
            if (this.curRender.jumping) {
                if (newEvent === '6_run') {
                    this.curEvent = '6_jump'
                }
                if (newEvent === '2_run') [
                    this.curEvent = '2_jump'
                ]
            }
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
            if (check(['K', 'C'])) {
                // 如果摁着X 要考虑能否跳过下面的障碍物
                if (_checkMapRemora(obstacle, this,() => {}, () => {}, { variationY: 10 }).every(v => v)) {
                    this.addPosition(Object.assign(oldPosition, { x: this.position.x + variation, y: this.position.y + 10 }))
                }
            }
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