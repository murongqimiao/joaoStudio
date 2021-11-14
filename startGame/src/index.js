import { footMan, walking, getImageFromX_Y, CONSTANT_COMMON } from "./data"

class Game {
    monsterList = []
    heroList = []
    constructor(props) {

    }

    run() {
        // 执行行为
        this.monsterList.forEach(v => v.action && v.action())
        this.heroList.forEach(v => v.action && v.action())

        // 执行render
        const allRenderList = [].concat(this.monsterList).concat(this.heroList)
        var c = document.getElementById('canvas');
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height)
        allRenderList.forEach(v => v.render({ ctx }))

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
        monster.onMonsterAdd && this.onMonsterAdd(monster)
    }

    addNewHero(hero) {
        console.log(hero)
        this.heroList.push(hero)
        hero.onHeroAdd && this.onHeroAdd(hero)
        return this;
    }

    // 钩子
    onMonsterAdd(monster) { }
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
    curRender = {
        imgClass: null,
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
    }
    addPosition(params) {
        const { x, y, z = 0 } = params;
        this.position = { x, y, z }
        return this;
    }
    // 渲染逻辑 找到指定的某个图片 某一帧  渲染到canvas里
    render() {
        const { ctx } = arguments[0]
        if (this.framesList[this.curEvent]) {
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
            const { sx, sy, swidth, sheight, width, height, } = getImageFromX_Y(imgClass, imgLR)
            const Img = document.getElementsByClassName(imgClass)[0]
            const { x, y } = this.position
            ctx.drawImage(Img, sx, sy, swidth, sheight, x, y, width, height)
            this.curRender.curFrame++
        }
    }
    addAction(eventName, func) {
        this[eventName] = func.bind(this)
        return this;
    }
}

const footManNew = new Role(footMan)
const gameNew = new Game()

footManNew.addPosition({ x: 0, y: 0, z: 0 }).addAction('action', walking)

gameNew.addNewHero(footManNew)




setTimeout(() => {
    gameNew.start()
}, 1000)



