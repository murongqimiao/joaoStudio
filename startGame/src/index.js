import { footMan, goldCoinInMap, walking, getImageFromX_Y, CONSTANT_COMMON } from "./data"

class Game {
    monsterList = []
    heroList = []
    keyCollect = []
    allRenderList = []
    constructor(props) {

    }

    run() {
        // 执行行为
        this.monsterList.forEach(v => v.action && v.action(this))
        this.heroList.forEach(v => v.action && v.action(this))

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
        this.monsterList.push(monster)
        console.log("第一次addNewMonster,", this.monsterList)
        monster.onMonsterAdd && this.onMonsterAdd(monster)
        this.updateAllRenderList()
        return this;
    }

    addNewHero(hero) {
        this.heroList.push(hero)
        console.log("diyici add new hero,", this.heroList)
        hero.onHeroAdd && this.onHeroAdd(hero)
        this.updateAllRenderList()
        return this;
    }

    // 更新
    updateAllRenderList() {
        this.allRenderList = [].concat(this.monsterList).concat(this.heroList)
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
        console.log(this.allRenderList[0])
    }

    // 钩子
    onMonsterAdd(monster) {
        monster.onMonsterAdd(this, monster)
    }
    onHeroAdd(hero) {
        hero.onHeroAdd(this, hero)
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
        this.framesList = props.framesList || {}
        this.framePerChange = props.framePerChange || {}
        this.zIndex = props.zIndex || 1
    }
    addPosition(params) {
        const { x, y, z = 0, yRegression = 0 } = params;
        this.position = { x, y, z, yRegression }
        return this;
    }
    // 渲染逻辑 找到指定的某个图片 某一帧  渲染到canvas里
    render() {
        const { ctx } = arguments[0]
        if (this.curEvent && this.framesList[this.curEvent]) {
            // 命中当前行为 进行渲染
            if (this.curRender.curFrame === this.framePerChange[this.curEvent]) { // 动画行进到下一张
                if (this.curRender.curFrameImgIndex === this.framesList[this.curEvent].length - 1) { // 重复动画归0
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
        ctx.drawImage(Img, sx, sy, swidth, sheight, x, y, width, height)
        // console.log(this.curRender.imgClass, x, y,)

    }
    addAction(eventName, func) {
        this[eventName] = func.bind(this)
        return this;
    }
}

const footManNew = new Role(footMan)
const gameNew = new Game()
const goldCoinInMapNew = new Role(goldCoinInMap)

footManNew.addPosition({ x: 0, y: 0, z: 0, yRegression: 20 }).addAction('action', walking)
goldCoinInMapNew.addPosition({ x: 100, y: 100, z: 0, yRegression: 5 })

gameNew.addNewHero(footManNew).addNewMonster(goldCoinInMapNew)


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




