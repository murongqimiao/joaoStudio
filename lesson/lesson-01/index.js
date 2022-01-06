import { footMan, Monster01, walking, getImageFromX_Y, CONSTANT_COMMON } from "./data"

/**
 * Game类 存储全局数据, 包括待渲染的资源列表
 */
class Game {
    monsterList = []
    heroList = []
    keyCollect = []
    keyCollectBuffer = []
    allRenderList = []
    currentRoleId = 0
    debug = 1
    constructor(props) {

    }

    run() {
        // 执行render
        var c = document.getElementById('canvas');
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height)
        this.allRenderList.forEach(v => {
            v.render && v.render({ ctx, debug: this.debug })
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

    addNewHero(hero) {
        this.heroList.push(hero)
        this.updateAllRenderList()
        return this;
    }

    // 更新
    updateAllRenderList() {
        this.allRenderList = [].concat(this.monsterList).concat(this.heroList).filter(v => !v.delete)
    }
}

/**
 * Role类 其实就是动画类, 负责描述单个动画对象
 */
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

    // 渲染逻辑 找到指定的某个图片 某一帧  渲染到canvas里
    render() {
        const { ctx, debug } = arguments[0]
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
            console.log("curFrameImgIndex")
            console.log(this.curRender.curFrameImgIndex)
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
        return this
    }
    addAction(eventName, func) {
        this[eventName] = func.bind(this)
        return this;
    }
}

const footManNew = new Role(footMan)
const gameNew = new Game()
window.__game = gameNew
window.__Role = Role

footManNew.addPosition({ x: 300, y: 300, z: 0, yRegression: 20 }).curEvent = 'DEFAULT'

window.__game.addNewHero(footManNew)



/**
 * 不判断图片资源加载状态, 直接两秒之后执行game
 */
setTimeout(() => {
    gameNew.start()
}, 2000)




