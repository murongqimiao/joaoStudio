import { getDistancesWidth, getFaceToDirection, computedDistance } from "./collisionDetection"
import { throwD6, throwD8, throwD12 } from "./random"
import { attackEvent } from "./attackEvent"
/**
 * monster mind
 * step1 find hero
 * 1.1 no hero can reach
 * 1.2 can`t attack
 * 1.3 can attack
 * step 2
 * 1.1.1 random
 * 1.2.1 move
 * 1.3.1 attack
 * step 3
 * 1.1.1.1 stay
 * 1.1.1.2 move
 * 1.1.1.3 stand
 * 1.1.1.4 keep
 */
export const monsterMainMind = function() {
    const monsterSelf = this
    const game = arguments[0]
    const { heroList } = game
    let limitDistance = getLimitDistancesWidthHero(monsterSelf, heroList)
    let direction = getFaceToDirection({
        x1: monsterSelf.position.x,
        y1: monsterSelf.position.y,
        x2: limitDistance.position.x,
        y2: limitDistance.position.y
    })
    if (monsterSelf.curEvent.includes('hit') || monsterSelf.curEvent.includes('death')) {
        // 被击 死亡 状态下什么都不能做
    } else if (limitDistance && limitDistance.distance && limitDistance.distance < 70) { // 攻击距离
        // 执行攻击行为
        let event = direction + '_attack'
        tryEvent(event, monsterSelf)
        const attackAim = heroList.filter(v => v.currentId === limitDistance.currentId)[0]
        monsterSelf.addAction('attackHero', attackHero, { needTrigger: true, codeDownTime: 0, attackAim })
    } else if (limitDistance && limitDistance.distance && limitDistance.distance < 200) { // 警戒范围
        // 执行移动行为
        let event = direction + '_run'
        tryEvent(event, monsterSelf)
    } else {
        let randomD6 = throwD6()
        let randomD8 = throwD8()
        let randomD12 = throwD12()
        // 随机行为 2
        switch(randomD6) {
            case 0:
            case 1:
                let event = randomD8 + '_stand'

                if (randomD12 > 9) { event = randomD8 + '_run' }

                tryEvent(event, monsterSelf)

                break;
            case 2:
            case 3:
            case 4:
            case 5:

            default: () => {}
        }
    }
}

const getLimitDistancesWidthHero = (monsterSelf, heroList) => {
    return heroList.map((v) => {
        return {
            currentId: v.currentId,
            distance: computedDistance(v.position.x, v.position.y, monsterSelf.position.x, monsterSelf.position.y),
            position: v.position
        }
    }).sort((a, b) => b - a)[0] || {}
}

const tryEvent = (event, that) => {
    if (that.curEvent !== event) {
        that.initFrameInfo(event)
    }
}

const computedCodeDownTime = () => {
    
}

const attackHero = function (game, triggerInfo) {
    const { attackAim } = triggerInfo
    if (this.curEvent.includes('death')) { return }
    if (this.curEvent.includes('attack') && this.curRender.curFrameImgIndex === 2 && this.curRender.curFrame === 1) {
        if (computedDistance(this.position.x, this.position.y, attackAim.position.x, attackAim.position.y) < 70) {
            // 命中
            let direction = getFaceToDirection({
                x1: attackAim.position.x,
                y1: attackAim.position.y,
                x2: this.position.x,
                y2: this.position.y
            })
            attackEvent(this, attackAim, 'normal')
            attackAim.resetFrameInfo(`${direction}_hit`)
            attackAim.addFrameEndEvent(attackAim.recoverFrameInfo.bind(attackAim))
        } else {
            // 击空
        }
        // 执行攻击时机
        this.removeAction('attackHero')
    }
}
