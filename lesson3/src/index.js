
import { loadInitResources } from "./utils/resources"
import { role01 } from "./data/role"
import { getBulkBorder } from "./utils/collisionDetection"
import { drawPolygon, drawDot } from "./utils/canvasTool"
import { addGameListener } from "./utils/addGameListener"

const drawFPS = function (ctx, gameFPS) {
    ctx.font = '20px Arial'
    ctx.fillStyle = '#fff'
    let FPSText = 'FPS:  ' + gameFPS
    ctx.direction = 'ltr'
    ctx.fillText(FPSText, 10, 20)
}

class Game {
    roleList = []
    environmentList = [] // 环境资源
    allRenderList = [] 
    keyCollect = [] // 当前活跃的按键
    keyCollectBuffer = [] // 活跃过的按键在缓冲区待一阵
    debug = 1
    gameFPS = 60
    currentFrameIndexPerSeconde = 0
    gameStatus = {
        loading: false
    }
    helloWorldPosition = {
        x: 0,
        directionRight: true,
        y: 0,
        directionBottom: true
    }

    /**
     * 每一帧执行的行为
     */
    run() {
        var c = document.getElementById('canvas');
        var ctx = c.getContext("2d");
        ctx.clearRect(0, 0, c.width, c.height)
        const that = this;

        this.updateAllRenderList()

        // 执行render行为
        this.allRenderList.forEach(v => {
            v.render && v.render({ ctx, debug: this.debug })
        })

        // 打印FPS
        drawFPS(ctx, this.gameFPS)

        // 执行下一帧
        this.currentFrameIndexPerSeconde++
        window.requestAnimationFrame(() => {
            this.run()
        })
    }

    addNewRole(roleItem) {
        roleItem.currentId = this.currentRoleId++
        this.roleList.push(roleItem)
        roleItem.onAdded && roleItem.onAdded(this, roleItem)
        this.updateAllRenderList()
        return this;
    }

    updateAllRenderList() {
        // update all render list and remove deleted
        this.allRenderList = [].concat(this.roleList).concat(this.environmentList).filter(v => { return !v.delete })
    }

    getFPS() {
        this.gameFPS = this.currentFrameIndexPerSeconde
        this.currentFrameIndexPerSeconde = 0
        return this
    }

    start() {
        console.log("running")
        console.log(+ new Date())
        window.requestAnimationFrame(() => {
            this.run()
        })
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


class Role {
    state = {}
    skill = {}
    position = {}
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
            // walking
        },
        curFrame: 0,
        frameCount: 0,
    }
    extraRenderList = []
    constructor(props) {
        this.state = JSON.parse(JSON.stringify(props.state))
        this.skill = props.skill
        this.onAdded = props.onAdded || null
        this.onDead = props.onDead || null
        this.onCrash = props.onCrash || null
        this.framesList = props.framesList || {}
        this.zIndex = props.zIndex || 1
    }
    addPosition(params) {
        const { x, y, z = 0, yRegression = 0 } = params;
        if (!this.position.x) {
            this.oldPosition = JSON.parse(JSON.stringify({ x, y, z, yRegression }))
        } else {
            this.oldPosition = JSON.parse(JSON.stringify(this.position))
        }
        this.position =  { x, y, z, yRegression }
        return this;
    }
    resetFrameInfo(eventName) {
        if (this.curRender.cantChangeEvent) return
        this.curRender.curEvent = this.curEvent
        if (!this.resetCurRender) {
            this.resetCurRender = JSON.parse(JSON.stringify(this.curRender))
        }
        this.initFrameInfo(eventName)
    }
    recoverFrameInfo() {
        if (this.resetCurRender && !this.curRender.cantChangeEvent) {
            this.curRender = this.resetCurRender
            this.curEvent = this.resetCurRender.curEvent
            delete this.resetCurRender
        }
    }
    initFrameInfo(curEvent) {
        if (!this.curRender.cantChangeEvent) {
            this.curRender.curFrame = 0
            this.curRender.curFrameImgIndex = 0
            if (curEvent) {
                this.curEvent = curEvent
            }
        }
        return this;
    }
    addFrameEndEvent(event) {
        if (this.nextFrameEndEvent) {
            this.nextFrameEndEvent.push(event)
        } else {
            this.nextFrameEndEvent = [event]
        }
    }
    // 渲染逻辑 找到指定的某个图片 某一帧  渲染到canvas里
    render() {
        const { ctx, debug } = arguments[0]
        let curRenderBother = null
        if (this.curEvent && this.framesList[this.curEvent]) {
            const frameList = this.framesList[this.curEvent]
            let { curFrameImgIndex, curFrame } = this.curRender
            // 解决高刷屏帧数过高的情况. 对于高刷屏, 比如180帧屏, 可以通过增加停留时间来保证体验的一致性
            const dynamicFrameStayTime = Math.round(window.__game.gameFPS / 60) * frameList[curFrameImgIndex].frameStayTime
            // 命中当前行为 进行渲染
            if (curFrame == dynamicFrameStayTime) { // 动画行进到下一张
                if (curFrameImgIndex === frameList.length - 1) { // 重复动画归0
                    // 钩子 执行完动画后, 判断帧动画结束时间是否存在
                    while (this.nextFrameEndEvent && this.nextFrameEndEvent.length) {
                      this.nextFrameEndEvent.shift()() // 帧动画结束事件 全部执行
                    }
                    if (!this.curRender.cantChangeEvent) {
                        this.curRender.curFrameImgIndex = 0
                        this.curRender.curFrame = 0
                    }
                } else {
                    this.curRender.curFrameImgIndex++
                    this.curRender.curFrame = 0
                }
            }
            // 提取img resource
            curRenderBother = frameList[curFrameImgIndex]
            this.curRender.curFrame++
        }
        let Img = window.resources[curRenderBother.name]
        const xywhs // 体积距离左侧距离顶部高宽及是否刚体
        = {
          x: Number(curRenderBother.volumeInfo.offsetLeft),
          y: Number(curRenderBother.volumeInfo.offsetTop),
          width: Number(curRenderBother.volumeInfo.width),
          height: Number(curRenderBother.volumeInfo.height),
          isSolid: Boolean(this.state.volumeInfo.solid)
        }
        const centerOriginxy // 距离
        = {
          x: Number(curRenderBother.centerOrigin.left),
          y: Number(curRenderBother.centerOrigin.top)
        }
        const imgSize // 图片原始大小
        = {
          x: Img.width,
          y: Img.height
        }
        const offset // 获取原始图片时从图片的哪里开始截取
        = {
          x: Number(curRenderBother._offsetLeft),
          y: Number(curRenderBother._offsetTop),
        }
        const imgRenderStyle // 获取图片渲染到画布中的信息
        = {
          x: Number(curRenderBother.renderStyle.width),
          y: Number(curRenderBother.renderStyle.height),
          transform: curRenderBother.renderStyle.transform
        }
        if (curRenderBother) {
            this.curRender.curFrameInfo = curRenderBother
            
            // const { x, y } = getMainViewportPostion(this.position) // 目前不计算相对地图位置的回归数据
            const { x, y } = this.position

            let renderXInCanvas = Math.round(x - centerOriginxy.x)
            let renderYInCanvas = Math.round(y - centerOriginxy.y)
            try {
              switch(imgRenderStyle.transform) { // 
                case 'turnX': 
                    ctx.save()
                    ctx.translate(renderXInCanvas + imgRenderStyle.x, renderYInCanvas)
                    ctx.scale(-1, 1)
                    ctx.drawImage(Img, offset.x, offset.y,imgSize.x, imgSize.y, 0, 0, imgSize.x, imgSize.y)
                    ctx.restore()
                  break;
                default: ctx.drawImage(Img, offset.x, offset.y,imgSize.x, imgSize.y, renderXInCanvas, renderYInCanvas, imgRenderStyle.x, imgRenderStyle.y)
              }
              if (debug) {
                // 图片描边
                drawPolygon({ ctx, color: '#fff' }, [renderXInCanvas,
                  renderYInCanvas,
                  renderXInCanvas,
                  renderYInCanvas + imgSize.y,
                  renderXInCanvas + imgSize.x,
                  renderYInCanvas + imgSize.y,
                  renderXInCanvas + imgSize.x,
                  renderYInCanvas]);
              }
            } catch (err) {
              console.log("=========== draw image error ==============", curRenderBother)
            }

            if (debug) {
                // 体积描边
                const borderData = getBulkBorder(this, xywhs, centerOriginxy, imgSize);
                switch (this.state.volumeInfo.shape) {
                    case 'rectangle':
                        drawPolygon({ ctx }, borderData);
                        break;
                    case 'circle':
                        drawDot({ ctx }, borderData)
                        break;
                    default: () => { }
                }
                // drawDot({ ctx, color: 'yellow' }, [getMainViewportPostion(this.position).x, getMainViewportPostion(this.position).y, 1] )
                drawDot({ ctx, color: 'yellow' }, [x, y, 1] )
            }
        }

        return this
    }

    addAction(eventName, func, config) {
        if (config.needTrigger) {
            if (!this.trigger) {
                this.trigger = []
            }
            this.trigger.push({
                eventName,
                codeDownTime: config.codeDownTime || 0,
                curTime: 0, // 当前执行了多少次
                ...config
            })
        }
        this[eventName] = func.bind(this)
        return this;
    }
    removeAction(eventName) {
        this.trigger = this.trigger.filter(v => v.eventName !== eventName) || []
        delete this[eventName]
        return this;
    }

    Death() {
        let direction = this.curEvent.slice(0, 1)
        this.initFrameInfo(`${direction}_death`)
        this.curRender.cantChangeEvent = true
        this.addFrameEndEvent(function() {
          if (!this.state.isHero) {
            console.log("==============death============", this)
            this.delete = true // hero 尸体保留
            window.__game.removeMonster(this)
          }
        }.bind(this))
    }
    addExtraRenderInfo (extraInfo) {
        let _extraInfo = extraInfo.bind(this)
        this.extraRenderList.push(_extraInfo())
        return this;
    }
}




let __game = new Game()
window.__game = __game
addGameListener(__game)



console.log("=======role==========")
console.log(role01)


loadInitResources(() => {
    console.log("window.resources", window.resources)
    __game.start()


    // 添加新的角色进入游戏
    let newRole001 = new Role(role01)
    newRole001.addPosition({ x: 300, y: 400 })
    __game.addNewRole(newRole001)
})
