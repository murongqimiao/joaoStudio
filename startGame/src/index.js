// import { footMan, Monster01, goldCoinInMap, walking, getImageFromX_Y, CONSTANT_COMMON } from "./data"
import { monster_01, monster_02, materials, user, walking, monsterEventHandler, skill_01, skill_02, MAP_REMORA, createName, showHp, gateWay01 } from "./cq_data"
import { collisionDetection, getBulkBorder, getXYWHSByString, getCenterOriginByString, getOffsetXYByString } from "./utils/collisionDetection"
import { loadInitResources, getPicByPicName, computedCurRenderBother } from "./utils/checkResourceLoad"
import { drawDot, drawPolygon, scalePoints, regressOrigin, flatArr } from "./utils/canvasTool"
import { monsterMainMind } from "./utils/monsterAI"
import { addGameListener } from "./utils/addGameListener"
import { attackAction } from "./utils/skills"
import { handleDrawInterface, startDrawInfo } from "./utils/systemInterface"
import { drawMap, checkPointInMap, checkMapRemora } from "./utils/drawMap"
import { getMainViewportPostion, moveViewportWhenHeroWalk } from "./utils/positionReset"

class Game {
    monsterList = []
    heroList = []
    skillList = []
    environmentList = [] // 环境资源
    keyCollect = []
    keyCollectBuffer = []
    allRenderList = []
    currentRoleId = 0
    debug = 0
    currentFrameIndexPerSeconde = 0
    gameFPS = 60
    gameStatus = {
        loading: false
    }
    mainViewportPosition = {
        height: 650, // 视口高 canvas
        width: 1024,
        cavnasId: 'canvas',
        leftDistances: 200, // distances from map left
        topDistances: 100,
        marginLeft: 100,
        marginTop: 150,
        marginRight: 100,
        marginBottom: 150,
        map: '_map_10023',
        scale: 0.5
    }
    actionViewPortPosition = {
        paddingLeft: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
    }
    constructor(props) {

    }

    run() {
        var c = document.getElementById('canvas');
        var ctx = c.getContext("2d");
        // 执行render
        ctx.clearRect(0, 0, c.width, c.height)
        const that = this;
        // 绘制地图
        drawMap({ ctx, mainViewportPosition: this.mainViewportPosition })
        
        // update skillItem
        this.skillList.forEach(v => { v.update && v.update(v) })
        // 执行行为
        let needUpdate = false
        this.allRenderList.forEach((v, index) => {
            v.trigger && v.trigger.forEach(triggerItem => {
                    if (triggerItem.curTime === triggerItem.codeDownTime) {
                        v[triggerItem.eventName] && v[triggerItem.eventName](this, triggerItem)
                        triggerItem.curTime = 0
                    } else {
                        triggerItem.curTime++
                    }
            })
            if (v.oldPosition) { // 移动过的元素才需要进行碰撞检测
                this.allRenderList.forEach((item, itemIndex) => {
                    // computed collision
                    if (v.currentId !== item.currentId
                        && v.curRender.curFrameInfo
                        && v.curRender.curFrameInfo.shape
                        && item.curRender.curFrameInfo
                        && item.curRender.curFrameInfo.shape
                        && collisionDetection(v, item)
                    ) {
                        // has crash
                        v.onCrash && v.onCrash(v, item, this)
                        // use postion before creash occur
                        if (v.oldPosition &&
                            v.curRender.curFrameInfo.volumeInfo.slice(-1) === '1' &&
                            item.curRender.curFrameInfo.volumeInfo.slice(-1) === '1') {
                            // solid crash with solid thing need back old position
                            v.position = JSON.parse(JSON.stringify(v.oldPosition))
                            // console.log("=============v==================", v)
                            delete v.oldPosition
                        }
                    }

                    // 检测地图障碍物 mapRule [], collisionCallBack, passCallBack
                    const mapRule = MAP_REMORA[this.mainViewportPosition.map]
                    if (mapRule) {
                        let _checkMapRemora = checkMapRemora.bind(this)
                        _checkMapRemora(mapRule,
                            v,
                            () => {
                                // 地图障碍物碰撞
                                if (v.state.isSolid) {
                                  // console.log("============地图碰撞检测===========", v)
                                  v.position = JSON.parse(JSON.stringify(v.oldPosition))
                                  delete v.oldPosition
                                }
                                if (v.crashObstacle) {
                                  v.crashObstacle(v, item, this)
                                }
                            },
                            () => {
                                // 地图障碍物没有发生碰撞
                            },
                            ctx
                        )
                    }
                })
            }
            if (v.delete) { needUpdate = true }
        })

        // 计算边界行走行为, 移动视口区域
        let curHero = this.heroList.filter(v => v.state.isHero)[0]
        if (curHero) { moveViewportWhenHeroWalk(curHero.position) }

        
        if (needUpdate) {
            this.updateAllRenderList()
        }

        // 计算render的层级顺序
        this.filterRenderListByPositionY()

        // 执行render行为
        this.allRenderList.forEach(v => {
            v.render && v.render({ ctx, debug: this.debug })
        })
        // 打印FPS
        ctx.font = '20px Arial'
        ctx.fillStyle = '#fff'
        let FPSText = 'FPS:  ' + that.gameFPS
        ctx.direction = 'ltr'
        ctx.fillText(FPSText, 10, 20)

        // 绘制系统界面
        handleDrawInterface({ ctx, game: this })

        // 执行下一帧
        this.currentFrameIndexPerSeconde++
        window.requestAnimationFrame(() => {
            this.run()
        })
    }

    getFPS() {
        this.gameFPS = this.currentFrameIndexPerSeconde
        this.currentFrameIndexPerSeconde = 0
        return this
    }

    resetMainViewportPosition(params) {
        this.mainViewportPosition = Object.assign({}, this.mainViewportPosition, params || {})
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
        // 检测地图障碍物 mapRule [], collisionCallBack, passCallBack
        const mapRule = MAP_REMORA[this.mainViewportPosition.map]
        let positionAvailable = true
        if (mapRule) {
            let _checkMapRemora = checkMapRemora.bind(this)
            _checkMapRemora(mapRule,
                monster,
                () => { positionAvailable = false },
            )
        }
        if (positionAvailable || monster.state.isNPC) {
            this.monsterList.push(monster)
            console.log("addNewMonster,", this.currentRoleId, this.monsterList)
            monster.onMonsterAdd && this.onMonsterAdd(monster)
            this.updateAllRenderList()
        } else {
            console.log('=============err==========')
            console.error('add new monster fail, new monster position not available')
        }
        return this;
    }

    addNewHero(hero) {
        hero.currentId = this.currentRoleId++
        // 检测地图障碍物 mapRule [], collisionCallBack, passCallBack
        const mapRule = MAP_REMORA[this.mainViewportPosition.map]
        let positionAvailable = true
        if (mapRule) {
            let _checkMapRemora = checkMapRemora.bind(this)
            _checkMapRemora(mapRule,
                hero,
                () => { positionAvailable = false },
            )
        }
        if (positionAvailable) {
            console.log("===========add success=========")
            this.heroList.push(hero)
            hero.onHeroAdd && this.onHeroAdd(hero)
            this.updateAllRenderList()
        } else {
            console.log("=========err==========")
            console.error("position is not available")
        }
        return this;
    }

    addNewSkill(skillItem) {
        skillItem.currentId = this.currentRoleId++
        this.skillList.push(skillItem)
        skillItem.onSkillAdd && skillItem.onSkillAdd(this).bind(skillItem)
        this.updateAllRenderList()
        return this;
    }

    removeMonster(monster) {
        let index = this.monsterList.findIndex(v => v.currentId === monster.currentId)
        this.monsterList.splice(index, 1)
        console.log("remove Monster,", this.monsterList)
        monster.onDead && monster.onDead(this, monster)
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

    removeSKill(skillItem) {
        let index = this.skillList.findIndex(v => v.currentId === skillItem.currentId)
        this.skillList.splice(index, 1)
        console.log("remove skill item", this.skillList)
        skillItem.onSkillRemove && skillItem.onSkillRemove(this).bind(skillItem)
        this.updateAllRenderList()
        return this;
    }



    // 更新
    updateAllRenderList() {
        // 更新时候移除已经删除的元素
        this.skillList.forEach(v => {
          if (v.delete) {
            this.removeSKill(v)
          }
        })
        this.allRenderList = [].concat(this.monsterList).concat(this.heroList).concat(this.environmentList).concat(this.skillList).filter(v => { return !v.delete })
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

    filterRenderListByPositionY() {
        // 根据y坐标调整角色渲染层级
        this.allRenderList.sort((a, b) => {
            if (a.curEvent && a.curRender.curFrameInfo && b.curEvent && b.curRender.curFrameInfo) {
                let aImageInfo = getCenterOriginByString(a.curRender.curFrameInfo.centerOrigin)
                let bImageInfo = getCenterOriginByString(a.curRender.curFrameInfo.centerOrigin)
                return ((a.position.y - aImageInfo.y) - (b.position.y - bImageInfo.y))
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
        monster.onDead(this, monster)
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
            // walking
        },
        curFrame: 0,
        frameCount: 0,
    }
    extraRenderList = []
    constructor(props) {
        this.state = JSON.parse(JSON.stringify(props.role))
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
            // 命中当前行为 进行渲染
            if (curFrame === frameList[curFrameImgIndex].frameStayTime) { // 动画行进到下一张
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
        let Img = ''
        if (this.state.isSprite) { // 雪碧图的取值逻辑不同
            /**
             * curRenderBother 
             *   centerOrigin: "187_219"
             *   frameStayTime: 7
             *   imgSizeInfo: "374_438"
             *   name: "_skill_new_jn10020_7_stand_0"
             *   shape: "rectangle"
             *   volumeInfo: "100_100_70_70_0
             */
            Img = getPicByPicName(this.state.logo)
            curRenderBother = computedCurRenderBother(this.state.logo)
        } else {
            Img = window.resources[curRenderBother.name]
        }
        const xywhs = getXYWHSByString(curRenderBother.volumeInfo)
        const centerOriginxy = getCenterOriginByString(curRenderBother.centerOrigin)
        const imgSize = getCenterOriginByString(curRenderBother.imgSizeInfo)
        const offset = getOffsetXYByString(curRenderBother.offset || "")
        if (curRenderBother) {
            this.curRender.curFrameInfo = curRenderBother
            
            const { x, y } = getMainViewportPostion(this.position)

            let renderXInCanvas = Math.round(x - centerOriginxy.x)
            let renderYInCanvas = Math.round(y - centerOriginxy.y)
            try {
              ctx.drawImage(Img, offset.x, offset.y,imgSize.x, imgSize.y, renderXInCanvas, renderYInCanvas, imgSize.x, imgSize.y)
            } catch (err) {
              console.log("=========== draw image error ==============", curRenderBother)
            }

            if (debug) {
                // 体积描边
                const borderData = getBulkBorder(this, xywhs, centerOriginxy, imgSize);
                switch (this.curRender.curFrameInfo.shape) {
                    case 'rectangle':
                        drawPolygon({ ctx }, borderData);
                        break;
                    case 'circle':
                        drawDot({ ctx }, borderData)
                        break;
                    default: () => { }
                }
                drawDot({ ctx, color: 'yellow' }, [getMainViewportPostion(this.position).x, getMainViewportPostion(this.position).y, 1] )
            }
        }
        // start draw the extra info
        if (this.extraRenderList) {
            startDrawInfo({ ctx }, this.extraRenderList)
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

    KnapsackGetSth(id, number) {
        if (this.state.knapsack && this.state.knapsack.length) {
            const haveThingList = this.state.knapsack.filter(v => v.id === id)
            if (haveThingList.length) {
                haveThingList[0].number += number
            }
        }
        return this
    }
    Death() {
        let direction = this.curEvent.slice(0, 1)
        this.initFrameInfo(`${direction}_death`)
        this.curRender.cantChangeEvent = true
        this.addFrameEndEvent(function() {
          if (!this.state.isHero) {
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

class Skill {
    state = {}
    position = {}
    curRender = {}
    timeReduceInfo = {}
    constructor(props) {
        this.state = props.state
        this.framesList = props.framesList
        this.onCrash = props.onCrash || null
        this.timeReduceInfo = props.timeReduceInfo || {}
        this.update = props.update || null
        this.crashObstacle = props.crashObstacle || null
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
        if (!this.resetCurRender) this.resetCurRender = JSON.parse(JSON.stringify(this.curRender))
        this.initFrameInfo(eventName)
    }
    recoverFrameInfo() {
        if (this.resetCurRender) {
            this.curRender = this.resetCurRender
            this.curEvent = this.resetCurRender.curEvent
            delete this.resetCurRender
        }
    }
    initFrameInfo(curEvent) {
        this.curRender.curFrame = 0
        this.curRender.curFrameImgIndex = 0
        if (curEvent) {
            this.curEvent = curEvent
        }
        return this
    }
    addFrameEndEvent(event) {
        if (this.nextFrameEndEvent) {
            this.nextFrameEndEvent.push(event)
        } else {
            this.nextFrameEndEvent = [event]
        }
        return this
    }
    // 渲染逻辑 找到指定的某个图片 某一帧  渲染到canvas里
    render() {
        const { ctx, debug } = arguments[0]
        let curRenderBother = null
        if (this.curEvent && this.framesList[this.curEvent]) {
            const frameList = this.framesList[this.curEvent]
            let { curFrameImgIndex, curFrame } = this.curRender
            // 命中当前行为 进行渲染
            if (curFrame === frameList[curFrameImgIndex].frameStayTime) { // 动画行进到下一张
                if (curFrameImgIndex === frameList.length - 1) { // 重复动画归0
                    // 钩子 执行完动画后, 判断帧动画结束时间是否存在
                    while (this.nextFrameEndEvent && this.nextFrameEndEvent.length) {
                      this.nextFrameEndEvent.shift()() // 帧动画结束事件 全部执行
                    }
                    this.curRender.curFrameImgIndex = 0
                    this.curRender.curFrame = 0
                } else {
                    this.curRender.curFrameImgIndex++
                    this.curRender.curFrame = 0
                }
            }
            // 提取img resource
            curRenderBother = frameList[curFrameImgIndex]
            this.curRender.curFrame++
        }
        const Img = window.resources[curRenderBother.name]
        const xywhs = getXYWHSByString(curRenderBother.volumeInfo)
        const centerOriginxy = getCenterOriginByString(curRenderBother.centerOrigin)
        const imgSize = getCenterOriginByString(curRenderBother.imgSizeInfo)
        if (curRenderBother) {
            this.curRender.curFrameInfo = curRenderBother
            const { x, y } = getMainViewportPostion(this.position)
            let renderXInCanvas = Math.round(x - centerOriginxy.x)
            let renderYInCanvas = Math.round(y - centerOriginxy.y)
            try {
              ctx.drawImage(Img, 0, 0,imgSize.x, imgSize.y, renderXInCanvas, renderYInCanvas, imgSize.x, imgSize.y)
              if (debug) {
                // 绘制图形的真实位置
                drawPolygon({ ctx, color: 'blue' }, [renderXInCanvas,
                  renderYInCanvas,
                  renderXInCanvas,
                  renderYInCanvas + imgSize.y,
                  renderXInCanvas + imgSize.x,
                  renderYInCanvas + imgSize.y,
                  renderXInCanvas + imgSize.x,
                  renderYInCanvas]);
              }
            } catch (err) {
              console.log(err, Img, curRenderBother.name)
            }

            if (debug) {
                // 体积描边
                const borderData = getBulkBorder(this, xywhs, centerOriginxy, imgSize);
                switch (this.curRender.curFrameInfo.shape) {
                    case 'rectangle':
                        drawPolygon({ ctx, color: 'blue' }, borderData);
                        break;
                    case 'circle':
                        drawDot({ ctx }, borderData)
                        break;
                    default: () => { }
                }
                drawDot({ ctx, color: 'yellow' }, [getMainViewportPostion(this.position).x, getMainViewportPostion(this.position).y, 1] )
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
}



const userNew = new Role(user)
const monster_01_new = new Role(monster_02)
const gateWay01New = new Role(gateWay01)
const gameNew = new Game()
window.skill_list = { skill_01, skill_02 } 
window.__game = gameNew
window.__Role = Role
window.__Skill = Skill

addGameListener(gameNew)



/**
 * 判断图片资源加载状态
 */
const that = this;
loadInitResources(() => {
    gameNew.start()
    setInterval(() => {
        gameNew.getFPS()
    }, 1000);

    gateWay01New
    .addPosition({ x: 708, y: 490, z: 0 })

    gameNew.resetMainViewportPosition()
    userNew
    .addPosition({ x: 550, y: 400, z: 0 })
    .addAction('action', walking, { needTrigger: true, codeDownTime: 0 })
    .addAction('attackAction', attackAction, { needTrigger: true, codeDownTime: 0 })
    .addExtraRenderInfo(createName)

    // 追加传送门
    gameNew.addNewHero(userNew).addNewMonster(gateWay01New)

    // 添加地图元素 地图元素应该跟地图绑定在一起作为一个场景的整体属性
        
    let monster_map_01 = [{
      position: {
        x: 650,
        y: 226,
      }
    },{
      position: {
        x: 290,
        y: 425,
      },
    },{
      position: {
        x: 840,
        y: 315,
      }
    }]
    monster_map_01.forEach(item => {
      gameNew.addNewMonster(
        new Role(Math.random() > 0.5 ? monster_01 : monster_02)
        .addPosition({ x: item.position.x, y: item.position.y, z: 0 })
        .addAction('monsterEventHandler', monsterEventHandler, { needTrigger: true, codeDownTime: 0})
        .addAction('mind', monsterMainMind, { needTrigger: true, codeDownTime: 60 })
        .addExtraRenderInfo(showHp)
      )
    })

})



