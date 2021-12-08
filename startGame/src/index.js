import { footMan, goldCoinInMap, walking, getImageFromX_Y, CONSTANT_COMMON } from "./data"
import { collisionDetection } from "./utils/collisionDetection"
class Game {
    monsterList = []
    heroList = []
    keyCollect = []
    allRenderList = []
    currentRoleId = 0
    constructor(props) {

    }

    run() {
        // 执行行为
        let needUpdate = false
        this.allRenderList.forEach((v, index) => {
            if (v.delete) { needUpdate = true }
            v.action && v.action(this)
            this.allRenderList.forEach((item, itemIndex) => {
                // computed collision
                if (index < itemIndex && v.curRender.lastFrame && item.curRender.lastFrame && collisionDetection(v, item)) { // 只计算一遍
                    v.onCrash && v.onCrash(v, item, this)
                    item.onCrash && item.onCrash(item, v, this)
                }
            })
        })
        if (needUpdate) {
            this.updateAllRenderList()
        }

        // 执行render
        var c = document.getElementById('canvas');
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height)
        this.filterRenderListByPositionY()
        this.allRenderList.forEach(v => {
            v.render && v.render({ ctx })
        })

        // 执行下一帧
        window.requestAnimationFrame(() => {
            this.run()
        })
    }

    start() {
        console.log("running")
        console.log(+ new Date())
        window.requestAnimationFrame(() => {
            this.run()
        })
    }

    addNewMonster(monster) {
        monster.currentId = this.currentRoleId++
        this.monsterList.push(monster)
        console.log("第一次addNewMonster,", this.monsterList)
        monster.onMonsterAdd && this.onMonsterAdd(monster)
        this.updateAllRenderList()
        return this;
    }

    addNewHero(hero) {
        hero.currentId = this.currentRoleId++
        this.heroList.push(hero)
        console.log("diyici add new hero,", this.heroList)
        hero.onHeroAdd && this.onHeroAdd(hero)
        this.updateAllRenderList()
        return this;
    }

    removeMonster(monster) {
        let index = this.monsterList.findIndex(v => v.name === monster.name)
        this.monsterList.splice(index, 1)
        console.log("remove Monster,", this.monsterList)
        monster.onMonsterDead && this.onMonsterDead(monster)
        this.updateAllRenderList()
        return this;
    }

    removeHero(hero) {
        let index = this.heroList.findIndex(v => v.name === hero.name)
        this.heroList.splice(index, 1)
        console.log("remove hero,", this.heroList)
        hero.onHeroDead && this.onHeroDead(hero)
        this.updateAllRenderList()
        return this;
    }

    // 更新
    updateAllRenderList() {
        this.allRenderList = [].concat(this.monsterList).concat(this.heroList).filter(v => !v.delete)
    }

    keyActiveCollect(handle, key) {
        if (handle === 'add') {
            if (!this.keyCollect.includes(key)) { this.keyCollect.push(key) }
        } else {
            if (this.keyCollect.includes(key)) {
                let index = this.keyCollect.indexOf(key)
                this.keyCollect.splice(index, 1)
            }
        }
    }

    filterRenderListByPositionY() {
        this.allRenderList.sort((a, b) => {
            if (a.curEvent && a.curRender.imgClass && b.curEvent && b.curRender.imgClass) {
                let aImageInfo = getImageFromX_Y(a.curRender.imgClass, a.curRender.imgLR)
                let bImageInfo = getImageFromX_Y(b.curRender.imgClass, b.curRender.imgLR)
                // console.log(aImageInfo.height, bImageInfo.height)
                return ((aImageInfo.height || 0) + a.position.y - a.position.yRegression) - ((bImageInfo.height || 0) + b.position.y - b.position.yRegression)
            } else {
                return false
            }
        })
    }

    // 钩子
    onMonsterAdd(monster) {
        monster.onMonsterAdd(this, monster)
    }
    onMonsterDead(monster) {
        monster.onMonsterDead(this, monster)
    }
    onHeroAdd(hero) {
        hero.onHeroAdd(this, hero)
    }
    onHeroDead(hero) {
        hero.onHeroDead(this, hero)
    }
    onMonsterMoveEnd(monster) { }
    onHeroMoveEnd(hero) { }
}

class Role {
    state = {}
    skill = {}
    position = {}
    onHeroAdd = null
    curEvent = null // 记录当前执行的事件
    zIndex = 1 // 渲染的层级
    curRender = {
        imgClass: null,
        imgLR: null,
        curFrameImgIndex: 0,
        curFrame: 0,
    } // 记录当前渲染内容
    frameList = {}
    frameInfo = {
        frameList: {
            walking
        },
        curFrame: 0,
        frameCount: 0,
    }
    constructor(props) {
        this.state = props.role
        this.skill = props.skill
        this.onHeroAdd = props.onHeroAdd || null
        this.onMonsterAdd = props.onMonsterAdd || null
        this.onDead = props.onDead || null
        this.onCrash = props.onCrash || null
        this.framesList = props.framesList || {}
        this.framePerChange = props.framePerChange || {}
        this.zIndex = props.zIndex || 1
    }
    addPosition(params) {
        const { x, y, z = 0, yRegression = 0 } = params;
        this.position = { x, y, z, yRegression }
        return this;
    }
    initFrameInfo(curEvent) {
        this.curRender.curFrame = 0
        this.curRender.curFrameImgIndex = 0
        if (curEvent) {
            this.curEvent = curEvent
        }
    }
    // 渲染逻辑 找到指定的某个图片 某一帧  渲染到canvas里
    render() {
        const { ctx } = arguments[0]
        if (this.curEvent && this.framesList[this.curEvent]) {
            // 命中当前行为 进行渲染
            if (this.curRender.curFrame === this.framePerChange[this.curEvent]) { // 动画行进到下一张
                if (this.curRender.curFrameImgIndex === this.framesList[this.curEvent].length - 1) { // 重复动画归0
                    // 钩子 执行完动画后, 判断帧动画结束时间是否存在
                    console.log("this.nextFrameEndEvent", this.nextFrameEndEvent)
                    this.nextFrameEndEvent && this.nextFrameEndEvent.length && this.nextFrameEndEvent.shift()() // 帧动画结束事件
                    this.curRender.curFrameImgIndex = 0
                    this.curRender.curFrame = 0
                } else {
                    this.curRender.curFrameImgIndex++
                    this.curRender.curFrame = 0
                }
            }
            const { imgClass, imgLR } = this.framesList[this.curEvent][this.curRender.curFrameImgIndex]
            this.curRender.imgClass = imgClass
            this.curRender.imgLR = imgLR
        }
        this.curRender.curFrame++
        const { sx, sy, swidth, sheight, width, height, } = getImageFromX_Y(this.curRender.imgClass, this.curRender.imgLR)
        const Img = document.getElementsByClassName(this.curRender.imgClass)[0]
        const { x, y } = this.position
        this.curRender.lastFrame = { // remember last frame animation
            x1: x,
            y1: y,
            x2: x,
            y2: y + height,
            x3: x + width,
            y3: y + height,
            x4: x + width,
            y4: y,
        }
        ctx.drawImage(Img, sx, sy, swidth, sheight, x, y, width, height)
        // console.log(this.curRender.imgClass, x, y,)
        return this
    }
    addAction(eventName, func) {
        this[eventName] = func.bind(this)
        return this;
    }
    KnapsackGetSth(id, number) {
        if (this.state.knapsack && this.state.knapsack.length) {
            const haveThingList = this.state.knapsack.filter(v => v.id === id)
            if (haveThingList.length) {
                haveThingList[0].number += number
            }
        }
        return this
    }
}

const footManNew = new Role(footMan)
const gameNew = new Game()
const goldCoinInMapNew = new Role(goldCoinInMap)
window.__heroList = {
    [footManNew.state.id]: footMan
}
window.__monsterList = {
    [goldCoinInMapNew.state.id]: goldCoinInMap
}
window.__game = gameNew
window.__Role = Role

footManNew.addPosition({ x: 0, y: 0, z: 0, yRegression: 20 }).addAction('action', walking)
goldCoinInMapNew.addPosition({ x: 100, y: 100, z: 0, yRegression: 5 })
window.__game.addNewHero(footManNew).addNewMonster(goldCoinInMapNew)





document.onkeydown = function (e) {    //对整个页面监听  
    var keyNum = window.event ? e.keyCode : e.which;       //获取被按下的键值  
    switch (keyNum) {
        case 74: // J
            gameNew.keyActiveCollect('add', 'J')
            break;
        case 75: // K
            gameNew.keyActiveCollect('add', 'K')
            break;
        case 76: // L
            gameNew.keyActiveCollect('add', 'L')
            break
        case 73: // I
            gameNew.keyActiveCollect('add', 'I')
            break
        default: () => { }
    }
}
document.onkeyup = (e) => { // 监听键盘抬起 停止对应行为
    var keyNum = window.event ? e.keyCode : e.which;
    switch (keyNum) {
        case 74: // J
            gameNew.keyActiveCollect('remove', 'J')
            break;
        case 75: // K
            gameNew.keyActiveCollect('remove', 'K')
            break;
        case 76: // L
            gameNew.keyActiveCollect('remove', 'L')
            break
        case 73: // I
            gameNew.keyActiveCollect('remove', 'I')
            break
        default: () => { }
    }
}

document.onkeypress = (e) => {
    // console.log(e)
}



setTimeout(() => {
    gameNew.start()
}, 1000)




