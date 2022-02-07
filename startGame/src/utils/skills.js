import { getSkillPositionWidthHero } from "./collisionDetection"

// 平砍
export const attackAction = function (game, triggerInfo) {
    const { attackAim, onlyOnce } = triggerInfo
    if (this.curEvent.includes('attack') && this.curRender.curFrameImgIndex === 0 && this.curRender.curFrame === 1) { // 第n个动画 第一vf
        console.log("==========exec attack action===========")
        let attackSkill = new window.__Skill(window.skill_list.skill_01) // 初始化一个技能对象, 放在合适的位置
        const { x, y } = getSkillPositionWidthHero(this, attackSkill)
        const heroDirection = this.curEvent.slice(0, 1)
        console.log("==============attackSkill==========")
        console.log(attackSkill)
        attackSkill
        .addPosition({ x, y, z: 0 })
        .initFrameInfo(`${heroDirection}_stand`)
        .addAction('deadTimeReduce', deadTimeReduce, { needTrigger: true, codeDownTime: 0, deadTime: 2, attackUser: this })
        game.addNewSkill(attackSkill)
        
        // let attackSkill.addPosition({})
        // if (computedDistance(this.position.x, this.position.y, attackAim.position.x, attackAim.position.y) < 70) {
        //     // 命中
        //     let direction = getFaceToDirection({
        //         x1: attackAim.position.x,
        //         y1: attackAim.position.y,
        //         x2: this.position.x,
        //         y2: this.position.y
        //     })
        //     attackAim.resetFrameInfo(`${direction}_hit`)
        //     attackAim.addFrameEndEvent(attackAim.recoverFrameInfo.bind(attackAim))
        // } else {
        //     // 击空
        // }
        // 执行攻击时机
        if (onlyOnce) {
            this.removeAction('attackAction')
        }
    }
}

const deadTimeReduce = function (game, triggerInfo) {
    const { attackUser } = triggerInfo;
    if (triggerInfo.deadTime < 1) {
        // 执行死亡动画
        this.delete = true
    }
    if (!attackUser.curEvent.includes('attack')) {
        triggerInfo.deadTime = 0
    }
    if (this.curRender.curFrameImgIndex === 0 && this.curRender.curFrame === 1) {
       // 每次执行到第一张图都要计算
        triggerInfo.deadTime--
    }
}