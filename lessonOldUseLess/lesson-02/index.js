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
        // 先执行一遍位置相关的逻辑
        this.allRenderList.forEach(v => {
            v.action && v.action(this)
        })
        // 进行渲染
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
        hero.onHeroAdd && this.onHeroAdd(hero)
        this.updateAllRenderList()
        return this;
    }

    onHeroAdd(hero) {
        hero.onHeroAdd(this, hero)
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
                // 松开的键要放入缓冲区, 来判定连续点击
                if (!this.keyCollect.includes(key)) {
                    this.keyCollectBuffer.push(key)
                }
                const removeBufferKey = () => {
                    setTimeout(() => {
                        let index = this.keyCollectBuffer.indexOf(key)
                        if (index > -1) {
                            if (!this.keyCollect.includes(key)) {
                                // key 未激活则移出缓冲区
                                this.keyCollectBuffer.splice(index, 1)
                            } else {
                                removeBufferKey()
                            }
                        }
                    }, 500);
                }
                removeBufferKey()
            }
        }
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

// lesson-02添加
footManNew.addPosition({ x: 300, y: 300, z: 0, yRegression: 20 }).addAction('action', walking)

window.__game.addNewHero(footManNew)


// lesson-02添加 监听键盘事件
document.onkeydown = function (e) {    //对整个页面监听  
    var keyNum = window.event ? e.keyCode : e.which;       //获取被按下的键值  
    console.log(keyNum)
    switch (keyNum) {
        case 37:
        case 74: // J
            gameNew.keyActiveCollect('add', 'J')
            break;
        case 40:
        case 75: // K
            gameNew.keyActiveCollect('add', 'K')
            break;
        case 39:
        case 76: // L
            gameNew.keyActiveCollect('add', 'L')
            break
        case 38:
        case 73: // I
            gameNew.keyActiveCollect('add', 'I')
            break
        default: () => { }
    }
}
document.onkeyup = (e) => { // 监听键盘抬起 停止对应行为
    var keyNum = window.event ? e.keyCode : e.which;
    switch (keyNum) {
        case 37:
        case 74: // J
            gameNew.keyActiveCollect('remove', 'J')
            break;
        case 40:
        case 75: // K
            gameNew.keyActiveCollect('remove', 'K')
            break;
        case 39:
        case 76: // L
            gameNew.keyActiveCollect('remove', 'L')
            break
        case 38:
        case 73: // I
            gameNew.keyActiveCollect('remove', 'I')
            break
        default: () => { }
    }
}


/**
 * 不判断图片资源加载状态, 直接两秒之后执行game
 */
setTimeout(() => {
    gameNew.start()
}, 2000)




