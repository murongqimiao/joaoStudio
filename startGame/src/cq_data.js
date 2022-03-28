import { getFaceToDirection } from "./utils/collisionDetection"
import { attackEvent } from "./utils/attackEvent"
import { throwD6 } from "./utils/random"

/**
 * generate by cq resource
 */
export const CONSTANT_COMMON = {
    COMMON_IMG_SIZE: {
        new_dco004: '203_227',
        new_dco005: '199_234',
        new_ms001: '152_178',
        new_ms002: '224_245',
        new_jn10020: '374_438',
        new_jn10234: '253_319',
    },
    COMMON_VOLUME_SIZE: {
        new_dco004: '75_85_40_40_1',
        new_dco005: '80_40_20_20_1',
        new_ms001: '60_85_35_35_1',
        new_ms002: '90_100_40_40_1',
        new_jn10020: [
            '150_70_70_100_0',
            '220_100_70_70_0',
            '210_100_100_115_0',
            '220_230_70_70_0',
            '150_230_70_70_0',
            '100_230_70_70_0',
            '100_150_70_70_0',
            '100_100_70_70_0'
        ],
        new_jn10234: [
            '90_105_30_30_0',
            '90_105_30_30_0',
            '90_105_30_30_0',
            '90_105_30_30_0',
            '90_105_30_30_0',
            '90_105_30_30_0',
            '90_105_30_30_0',
            '90_105_30_30_0',
        ]
    },
    COMMON_ORIGIN_CENTER: {
        new_dco004: '95_125',
        new_dco005: '100_117',
        new_ms001: '78_120',
        new_ms002: '108_140',
        new_jn10020: '187_219',
        new_jn10234:  '105_150',
    },
    SKILL_POSITION: { // 技能位置相对于人物当前方向的位移
        skill_01: ['0_0', '0_0', '0_0', '0_0', '0_0', '0_0', '0_0', '0_0'],
        skill_02: ['0_-30', '30_-30', '30_-15', '30_15', '0_30', '-30_30', '-30_-15', '-30_-30'],
    },
    BASE_HERO_HP: 3,
    BASE_HERO_ATK: 1,
    BASE_HERO_DEF: 0,
    BASE_HERO_MAGIC: 3,
    BASE_HERO_SPD: 4,
    BASE_MONSTER_SPD: 1,
    BASE_ONE_SECOND: 60,
    DPR: 3,
    INFINITY: 999999999,
    BASE_SKILL_HP: 1,
}

export const SYSTEM_INTERFACE_INFO_COMMON = {
    BASE_BOARD: {
        LEFT: 100,
        TOP: 500,
        IMG_WIDTH: 60,
        IMG_HEIGHT: 60,
        WIDTH: 100,
        HEIGHT: 100,
        FRAME_TIME: 0,
        FRAME_STAY: 0,
        IMG: () => `_systemInterface_blood_back1`
    },
    HP_INFO: {
        PADDING_TOP: 40,
        PADDING_BOTTOM: 80,
        LEFT: 83,
        TOP: 478,
        IMG_WIDTH: 172,
        IMG_HEIGHT: 244,
        WIDTH: 115,
        HEIGHT: 165,
        FRAME_TIME: 18,
        FRAME_STAY: 5,
        IMG: (n) => `_systemInterface_hp_0_stand_${n}`,
    },
    MP_INFO: {
        LEFT: 148,
        TOP: 478,
        IMG_WIDTH: 172,
        IMG_HEIGHT: 244,
        WIDTH: 115,
        HEIGHT: 165,
        FRAME_TIME: 18,
        FRAME_STAY: 5,
        IMG: (n) => `_systemInterface_mp_0_stand_${n}`,
    },
}

// current available img
const CONSTANT_IMG = {
    new_dco004: 'new_dco004',
    new_dco005: 'new_dco005',
    new_ms001: 'new_ms001',
    new_ms002: 'new_ms002',
    new_jn10020: 'new_jn10020',
    new_jn10234: 'new_jn10234',
}

export const MAP_REMORA = {
   '_map_10023': [{
       polygonPoints: [
           [252, 889],
           [225, 996],
           [810, 1251],
           [1980, 670],
           [1390, 379],
           [1285, 361],
           [963, 523],
           [932, 655],
           [783, 738],
           [538, 739]
        ],
       type: 'in'
   }] 
}

const recoverStateFunc = function () {
  const [self, crashItem] = arguments
  if (crashItem.state.isHero) {
    window.__game.removeMonster(self)
    // 恢复hero血量
    if (crashItem.state[this.state.maxRecoverKey] && crashItem.state[this.state.recoverKey]) {
      let variation = Math.floor(crashItem.state.maxHp * this.state.recoverAmount)
      console.log("variation", variation)
      if (crashItem.state[this.state.recoverKey] + variation > crashItem.state[this.state.maxRecoverKey]) {
        crashItem.state[this.state.recoverKey] = crashItem.state[this.state.maxRecoverKey] // full hp 
      } else {
        crashItem.state[this.state.recoverKey] += variation
      }
    }
  }
}

/**
 * generate frame list by params 
 * @param {*} params
 * type human | monster
 * attackTime deathTime hitTime skillTime standTime   times of animation
 * attackFrame deathFrame hitFrame skillFrame standFrame  times of frames per change
 * volume x_y_w_h_${1|0}  position x position y width height  isSolid
 * centerOrigin x_y // the real center of postion
 */
const generateFrameList = (params) => {
    const direction = [0,1,2,3,4,5,6,7];
    const defaultComputedKey = params.computedKey || ['attack', 'death', 'hit', 'skill', 'stand', 'run']
    const { type = 'human', volumeInfo = '0_0_0_0_0', centerOrigin = '0_0', imgSizeInfo = '0_0', name, shape = 'rectangle' } = params
    let result = {}
    direction.forEach(index => {
        defaultComputedKey.forEach(key => {
            let frameItem = []
            let frameMaxNum = params[`${key}Time`]
            let frameStayTime = params[`${key}Frame`]
            if (frameMaxNum) {
                for (let i = 0; i <= frameMaxNum; i++) {
                    let _name = `_character_${type}_${name}_${index}_${key}_${i}`
                    let _volumeInfo = volumeInfo
                    let _centerOrigin = centerOrigin
                    if (type === 'monster' && key === 'run') { // monster没有run 动作用stand取代
                        _name = `_character_${type}_${name}_${index}_stand_${i}`
                    }

                    if (type === 'skill') {
                        _name = `_${type}_${name}_${index}_stand_${i}`
                    }

                    if (typeof _volumeInfo !== 'string') {
                        // string 类型是所有方向都可以通过一个xy来回归 否则走Array类型, 生成不同方向的回归坐标
                        _volumeInfo = volumeInfo[index]
                    }

                    if (typeof _centerOrigin !== 'string') {
                        _centerOrigin = centerOrigin[index]
                        console.log("__________-centerOrigin_________")
                        console.log(_centerOrigin)
                    }

                    frameItem.push({
                        name: _name,
                        frameStayTime,
                        volumeInfo: _volumeInfo,
                        centerOrigin: _centerOrigin,
                        imgSizeInfo,
                        shape
                    })
                    
                }
            }
            result[`${index}_${key}`] = frameItem
        })
    })
    return result
}

const monsterDrop = function (game, monster) {
  const { position, state } = monster
  const { drop } = state
  let dropName = null
  let throwD6Result = ''
  if (drop.throwD6) {
    for (let i = 0; i < drop.throwD6; i++) {
      throwD6Result += (throwD6() + '')
    }
    dropName = drop.result[throwD6Result] || ''
  }
  console.log('===========dropName==========', dropName)
  if (!dropName) return
  game.addNewMonster(
    // new window.__Role(materials[dropName])
    new window.__Role(materials['0001'])
    .addPosition({
      x: Math.floor(position.x),
      y: Math.floor(position.y)
    })
  )
}

/**
 * main role info  {}
 *      [role, skill]
 *      role {}
 *          [name, des, hp, atk, def, magic, spd]
 *      skill {}
 *          [cd]
 */
export const user = {
    role: {
        id: 1,
        name: "主角abc",
        des: "user control human description",
        hp: CONSTANT_COMMON.BASE_HERO_HP,
        atk: CONSTANT_COMMON.BASE_HERO_ATK,
        def: CONSTANT_COMMON.BASE_HERO_DEF,
        spd: CONSTANT_COMMON.BASE_HERO_SPD,
        isSolid: true,
        isHero: true,
        maxHp:  CONSTANT_COMMON.BASE_HERO_HP,
        volumeInfo: {
            shape: 'rectangle',
            width: 30,
            height: 80,
            solid: true,
        },
        knapsack: [{
            id: 1,
            number: 0
        }],
        defaultEvent: '4_stand'
    },
    skill: {
        cd: CONSTANT_COMMON.BASE_ONE_SECOND
    },
    zIndex: 10,
    // 图片渲染的优化方向, 提供一个使用大图的高宽及横纵下标返回图片的能力
  
    framesList: generateFrameList({
        name: 'new_dco004',
        type: 'human',
        attackTime: 6,
        attackFrame: 5,
        deathTime: 3,
        deathFrame: 5,
        hitTime: 2,
        hitFrame: 5,
        skillTime: 6,
        skillFrame: 5,
        standTime: 3,
        standFrame: 10,
        runTime: 7,
        runFrame: 5,
        imgSizeInfo: CONSTANT_COMMON.COMMON_IMG_SIZE['new_dco004'],
        volumeInfo: CONSTANT_COMMON.COMMON_VOLUME_SIZE['new_dco004'],
        centerOrigin: CONSTANT_COMMON.COMMON_ORIGIN_CENTER['new_dco004'],
        shape: 'rectangle'
    }),
    onHeroAdd: function () {
        const [game, self] = arguments
        self.curEvent = self.state.defaultEvent
    },
    onCrash: function () {
        const [self, crashItem] = arguments
        if (crashItem.state.isSolid) {
            if (self.curRender.lastFrame) {
                this.position.x = self.curRender.lastFrame.x1
                this.position.y = self.curRender.lastFrame.y1
            }
        }
    }
}



/**
 * main role info  {}
 *      [role, skill]
 *      role {}
 *          [name, des, hp, atk, def, magic, spd]
 *      skill {}
 *          [cd]
 */
 export const monster_01 = {
    role: {
        id: 1,
        name: "new_ms001",
        des: "monster named chicken",
        hp: CONSTANT_COMMON.BASE_HERO_HP,
        maxHp: CONSTANT_COMMON.BASE_HERO_HP,
        atk: CONSTANT_COMMON.BASE_HERO_ATK,
        def: CONSTANT_COMMON.BASE_HERO_DEF,
        spd: CONSTANT_COMMON.BASE_MONSTER_SPD,
        isSolid: true,
        isMonster: true,
        volumeInfo: {
            shape: 'rectangle',
            width: 30,
            height: 80,
            solid: true,
        },
        knapsack: [{
            id: 1,
            number: 0
        }],
        defaultEvent: '0_stand',
        codeDownTime: {
            attack: 100
        },
        drop: {
          throwD6: 2, // throw d6 times
          result: {
            '10': 'g_icon_money4',
            '11': 'g_icon_money4',
            '12': 'g_icon_money4',
            '13': 'g_icon_money4',
            '14': 'g_icon_money4',
            '15': 'g_icon_money4',
            '16': 'g_icon_money4',
            '20': 'g_icon_money4',
            '21': 'g_icon_money4',
            '22': 'g_icon_money4',
            '23': 'g_icon_money4',
            '24': 'g_icon_money4',
            '25': 'g_icon_money4',
            '30': '0001',
            '31': '0001',
            '32': '0001',
            '33': '0002',
            '34': '0002',
            '35': '0003',
            '40': '0004',
            '41': '0004',
            '42': '0004',
            '43': '0005',
            '44': '0005',
            '45': '0006',
          }
        }
    },
    skill: {
        cd: CONSTANT_COMMON.BASE_ONE_SECOND
    },
    zIndex: 10,
    // 图片渲染的优化方向, 提供一个使用大图的高宽及横纵下标返回图片的能力
  
    framesList: generateFrameList({
        name: 'new_ms001',
        type: 'monster',
        attackTime: 5,
        attackFrame: 5,
        deathTime: 4,
        deathFrame: 5,
        hitTime: 2,
        hitFrame: 10,
        skillTime: 6,
        skillFrame: 5,
        standTime: 3,
        standFrame: 20,
        runTime: 3,
        runFrame: 20,
        imgSizeInfo: CONSTANT_COMMON.COMMON_IMG_SIZE['new_ms001'],
        volumeInfo: CONSTANT_COMMON.COMMON_VOLUME_SIZE['new_ms001'],
        centerOrigin: CONSTANT_COMMON.COMMON_ORIGIN_CENTER['new_ms001'],
        shape: 'rectangle'
    }),
    onMonsterAdd: function () {
        const [game, self] = arguments
        self.curEvent = self.state.defaultEvent
    },
    onCrash: function () {
        const [self, crashItem] = arguments
        if (crashItem.state.isSolid) {
            if (self.curRender.lastFrame) {
                this.position.x = self.curRender.lastFrame.x1
                this.position.y = self.curRender.lastFrame.y1
            }
        }
    },
    onDead: monsterDrop
}

/**
 * main role info  {}
 *      [role, skill]
 *      role {}
 *          [name, des, hp, atk, def, magic, spd]
 *      skill {}
 *          [cd]
 */
 export const monster_02 = {
    role: {
        id: 2,
        name: "new_ms002",
        des: "monster named deer",
        hp: CONSTANT_COMMON.BASE_HERO_HP,
        maxHp: CONSTANT_COMMON.BASE_HERO_HP,
        atk: CONSTANT_COMMON.BASE_HERO_ATK,
        def: CONSTANT_COMMON.BASE_HERO_DEF,
        spd: CONSTANT_COMMON.BASE_MONSTER_SPD,
        isSolid: true,
        isMonster: true,
        volumeInfo: {
            shape: 'rectangle',
            width: 30,
            height: 80,
            solid: true,
        },
        knapsack: [{
            id: 1,
            number: 0
        }],
        codeDownTime: {
            attack: 100
        },
        defaultEvent: '0_stand',
        drop: {
          throwD6: 2, // throw d6 times
          result: {
            '10': 'g_icon_money4',
            '11': 'g_icon_money4',
            '12': 'g_icon_money4',
            '13': 'g_icon_money4',
            '14': 'g_icon_money4',
            '15': 'g_icon_money4',
            '16': 'g_icon_money4',
            '20': 'g_icon_money4',
            '21': 'g_icon_money4',
            '22': 'g_icon_money4',
            '23': 'g_icon_money4',
            '24': 'g_icon_money4',
            '25': 'g_icon_money4',
            '30': '0001',
            '31': '0001',
            '32': '0001',
            '33': '0002',
            '34': '0002',
            '35': '0003',
            '40': '0004',
            '41': '0004',
            '42': '0004',
            '43': '0005',
            '44': '0005',
            '45': '0006',
          }
        }
    },
    skill: {
        cd: CONSTANT_COMMON.BASE_ONE_SECOND
    },
    zIndex: 10,
    // 图片渲染的优化方向, 提供一个使用大图的高宽及横纵下标返回图片的能力
  
    framesList: generateFrameList({
        name: 'new_ms002',
        type: 'monster',
        attackTime: 5,
        attackFrame: 10,
        deathTime: 7,
        deathFrame: 5,
        hitTime: 2,
        hitFrame: 10,
        skillTime: 6,
        skillFrame: 5,
        standTime: 3,
        standFrame: 20,
        runTime: 3,
        runFrame: 20,
        imgSizeInfo: CONSTANT_COMMON.COMMON_IMG_SIZE['new_ms002'],
        volumeInfo: CONSTANT_COMMON.COMMON_VOLUME_SIZE['new_ms002'],
        centerOrigin: CONSTANT_COMMON.COMMON_ORIGIN_CENTER['new_ms002'],
        shape: 'rectangle'
    }),
    onMonsterAdd: function () {
        const [game, self] = arguments
        self.curEvent = self.state.defaultEvent
    },
    onDead: function (game, monster) {
      const { position } = monster
      game.addNewMonster(
        new window.__Role(materials['g_icon_money4'])
        .addPosition({
          x: Math.floor(position.x),
          y: Math.floor(position.y)
        })
      )
    },
    onDead: monsterDrop,
    onCrash: function () {
        const [self, crashItem] = arguments
        if (crashItem.state.isSolid) {
            if (self.curRender.lastFrame) {
                this.position.x = self.curRender.lastFrame.x1
                this.position.y = self.curRender.lastFrame.y1
            }
        }
    }
}

/**
 * skill info
 * @param {*} game 
 * @returns 
 */
export const skill_01 = {
    state: {
        name: CONSTANT_IMG.new_jn10020,
        positionWidthHero: CONSTANT_COMMON.SKILL_POSITION.skill_01,
        atk: CONSTANT_COMMON.BASE_HERO_ATK
    },
    framesList: generateFrameList({
        name: CONSTANT_IMG.new_jn10020,
        type: 'skill',
        standTime: 5,
        standFrame: 7,
        imgSizeInfo: CONSTANT_COMMON.COMMON_IMG_SIZE[CONSTANT_IMG['new_jn10020']],
        volumeInfo: CONSTANT_COMMON.COMMON_VOLUME_SIZE[CONSTANT_IMG['new_jn10020']],
        centerOrigin: CONSTANT_COMMON.COMMON_ORIGIN_CENTER[CONSTANT_IMG['new_jn10020']],
        shape: 'rectangle'
    }),
    onSkillAdd: function() {
    },
    onCrash: function() {
        const [skillItem, crashItem, game] = arguments
        if (
            skillItem.curRender.curFrameImgIndex === 3 &&
            skillItem.curRender.curFrame === 5 // when computed crash with  第5帧动画开始计算有效伤害
        ) {
            if (crashItem.state.isMonster) {
                let direction = getFaceToDirection({
                    x1: crashItem.position.x,
                    y1: crashItem.position.y,
                    x2: skillItem.position.x,
                    y2: skillItem.position.y
                })

                // exec attack action
                attackEvent(skillItem, crashItem, 'normal')
                if (crashItem.curEvent.includes('death')) { return }
                crashItem.resetFrameInfo(`${direction}_hit`)
                crashItem.addFrameEndEvent(crashItem.recoverFrameInfo.bind(crashItem))
            }
        }
    }
    
}

export const skill_02 = {
  state: {
      name: CONSTANT_IMG.new_jn10234,
      positionWidthHero: CONSTANT_COMMON.SKILL_POSITION.skill_02,
      atk: CONSTANT_COMMON.BASE_HERO_ATK,
      acceleratedSpeed: 0.2,
      origin: null,
  },
  framesList: generateFrameList({
      name: CONSTANT_IMG.new_jn10234,
      type: 'skill',
      standTime: 5,
      standFrame: 7,
      imgSizeInfo: CONSTANT_COMMON.COMMON_IMG_SIZE[CONSTANT_IMG['new_jn10234']],
      volumeInfo: CONSTANT_COMMON.COMMON_VOLUME_SIZE[CONSTANT_IMG['new_jn10234']],
      centerOrigin: CONSTANT_COMMON.COMMON_ORIGIN_CENTER[CONSTANT_IMG['new_jn10234']],
      shape: 'circle'
  }),
  timeReduceInfo : {
    needTrigger: true, codeDownTime: 0, deadTime: 5, leaveHands: true
  },
  onSkillAdd: function() {
  },
  update: function () {
    // skill 02 将沿着直线前进, 首先确定一个方向, 匀速模式使用S = v * t 加速度模式根据 S = 1/2 * a * t^ 来进行计算 
    const [item] = arguments
    if (!item.origin) {
      item.origin = JSON.parse(JSON.stringify(item.position)) // 深拷贝一份当前位置用来做位移参考
    } else {
      item.oldPosition = JSON.parse(JSON.stringify(item.position))
    }

    if (!item.leftTime) {
      item.leftTime = 1
    } else {
      item.leftTime++
    }
    let direction = item.curEvent.slice(0,1)
    // let variation = Math.floor(1/2 * item.state.acceleratedSpeed * item.leftTime * item.leftTime)
    let variation = Math.floor(1/2 * item.state.acceleratedSpeed * item.leftTime * 50)  // 匀速运动模式
    let slantVariation = Math.floor(variation / 1.41)
    let variationX = [0, 1 * slantVariation, variation, 1 * slantVariation, 0, -1 * slantVariation, -1 * variation, -1 * slantVariation][direction]// x轴的变化量
    let variationY = [-1 * variation, -1 * slantVariation, 0, 1 * slantVariation, 1 * variation, 1 * slantVariation, 0, -1 * slantVariation][direction] // y 轴的变化量
    item.position.x = item.origin.x + variationX
    item.position.y = item.origin.y + variationY
  },
  onCrash: function() {
      const [skillItem, crashItem, game] = arguments
      if (crashItem.state.isMonster) {
          // 每n帧只能伤害一次
          let n = 10
          if (crashItem.skillDamageCodeDown && crashItem.skillDamageCodeDown < n) {
            crashItem.skillDamageCodeDown++
            return
          } else {
            crashItem.skillDamageCodeDown = 1
          }
          let direction = getFaceToDirection({
              x1: crashItem.position.x,
              y1: crashItem.position.y,
              x2: skillItem.position.x,
              y2: skillItem.position.y
          })

          // exec attack action
          attackEvent(skillItem, crashItem, 'normal')
          if (crashItem.curEvent.includes('death')) { return }
          crashItem.resetFrameInfo(`${direction}_hit`)
          crashItem.addFrameEndEvent(crashItem.recoverFrameInfo.bind(crashItem))
      }
  },
  crashObstacle: function() {
    const [skillItem, crashItem, game] = arguments
    // 遇到障碍物悬停
    skillItem.position = JSON.parse(JSON.stringify(skillItem.oldPosition))
    delete skillItem.oldPosition
  }
  
}

/**
 * action info {}
 * 
 */
 export const walking = function (game) {
    const that = this
    const { spd } = this.state;
    if (this.curEvent.includes('hit')) { // hit 状态下不能进行任何操作
        return
    }
    if (this.curEvent.includes('death')) { // death 状态下不能进行任何操作
        return
    }
    
    let direct = this.state.defaultEvent
    let computedKeyList = JSON.parse(JSON.stringify(game.keyCollect))
    let computedKeyListBuffer = JSON.parse(JSON.stringify(game.keyCollectBuffer))
    if (computedKeyList.includes('J') && computedKeyList.includes('L')) {
        // 只考虑IK方向
        ['J', 'L'].forEach(key => computedKeyList.splice(computedKeyList.indexOf(key)))
    } else if (computedKeyList.includes('I') && computedKeyList.includes('K')) {
        // 只考虑JL方向
        ['I', 'K'].forEach(key => computedKeyList.splice(computedKeyList.indexOf(key)))
    }
    if (computedKeyList.length) {
        const check = (list, ifOne) => {
            if (ifOne) {
              return list.map(v => computedKeyList.includes(v)).some(v => v)
            } else {
              return list.map(v => computedKeyList.includes(v)).every(v => v)
            }
        }
        const hasInBuffer = (list) => {
            return list.map(v => computedKeyListBuffer.includes(v)).some(v => v)
        }
        // 状态保持动作, 如移动, 需要按压施法
        if (check(['J', 'I'])) {
            direct = '7_run' + (hasInBuffer(['J', 'I']) ? '' : '')
        } else if (check(['I', 'L'])) {
            direct = '1_run' + (hasInBuffer(['I', 'L']) ? '' : '')
        } else if (check(['J', 'K'])) {
            direct = '5_run' + (hasInBuffer(['J', 'K']) ? '' : '')
        } else if (check(['K', 'L'])) {
            direct = '3_run' + (hasInBuffer(['K', 'L']) ? '' : '')
        } else if (check(['I'])) {
            direct = '0_run' + (hasInBuffer(['I']) ? '' : '')
        } else if (check(['J'])) {
            direct = '6_run' + (hasInBuffer(['J']) ? '' : '')
        } else if (check(['K'])) {
            direct = '4_run' + (hasInBuffer(['K']) ? '' : '')
        } else if (check(['L'])) {
            direct = '2_run' + (hasInBuffer(['L']) ? '' : '')
        }
        if (check(['D'], true)) {
            direct = this.curEvent.slice(0, 1) + '_attack'
            this.skill.current = 'skill_01'
        }
        if (check(['S'], true)) {
            direct = this.curEvent.slice(0, 1) + '_attack'
            this.skill.current = 'skill_02'
        }
        // 单次执行动作, 如攻击,一次性技能
    }
    if (direct !== this.curEvent) { // 动作变更
        // 更换动作需要初始化的帧动画
        if (direct === this.state.defaultEvent) { // 没有键盘事件或键盘事件停止
            if (this.curEvent === this.curEvent.slice(0, 1) + '_stand') {
            } else {
                this.curEvent = this.curEvent.slice(0, 1) + '_stand'
                this.curRender.curFrameImgIndex = 0
                this.curRender.curFrame = 0
            }
        } else {
            this.curEvent = direct
            this.curRender.curFrameImgIndex = 0
            this.curRender.curFrame = 0
        }
    }
    handleMove(direct, that)
    return this;
}

/**
 * monster basic action
 */
export const monsterEventHandler = function (game)  {
    const that = this
    if (this.curEvent.includes('_run')) {
        handleMove(this.curEvent, that)
    }
    if (this.curEvent.includes('_stand')) {
        handleMonsterStand(this.curEvent, that)
    }
    if (this.curEvent.includes('_attack')) {
        if (this.state.codeDownTime.attack) {
                if (!this.state.codeDownTime.attackCurTime) {
                    console.log("this.state.codeDownTime.attackCurTime")
                    console.log(this.state.codeDownTime.attackCurTime)
                    this.state.codeDownTime.attackCurTime = (this.state.codeDownTime.attackCurTime || 0) + 1
                    console.log(this.state.codeDownTime.attackCurTime)
                } else if (this.state.codeDownTime.attackCurTime === this.state.codeDownTime.attack) {
                    this.state.codeDownTime.attackCurTime = 1
                } else if (this.state.codeDownTime.attackCurTime > (this.curRender.curFrameInfo.frameStayTime * this.framesList[this.curEvent].length)) {
                    this.initFrameInfo(this.curEvent)
                    this.state.codeDownTime.attackCurTime += 1
                } else {
                    this.state.codeDownTime.attackCurTime += 1
                }
        } 
    }
}

/**
 * handle move
 */
const handleMove = function (event, that) {
    const oldPosition = JSON.parse(JSON.stringify(that.position))
    const { spd } = that.state;
    switch (event) {
        case '0_run':
            that.addPosition(Object.assign(oldPosition, { y: that.position.y - spd }))
            break
        case '1_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x + spd, y: that.position.y - spd }))
            break
        case '7_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x - spd, y: that.position.y - spd }))
            break
        case '2_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x + spd }))
            break
        case '4_run':
            that.addPosition(Object.assign(oldPosition, { y: that.position.y + spd }))
            break
        case '6_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x - spd }))
            break
        case '5_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x - spd, y: that.position.y + spd }))
            break
        case '3_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x + spd, y: that.position.y + spd }))
            break
        default: () => {}
    }
}

/**
 * handle monster stand
 */
const handleMonsterStand = function (event, that) {
    const oldPosition = JSON.parse(JSON.stringify(that.position))
    const { spd } = that.state;
    switch (event) {
        case '0_run':
            that.addPosition(Object.assign(oldPosition, { y: that.position.y - spd }))
            break
        case '1_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x + spd, y: that.position.y - spd }))
            break
        case '7_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x - spd, y: that.position.y - spd }))
            break
        case '2_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x + spd }))
            break
        case '4_run':
            that.addPosition(Object.assign(oldPosition, { y: that.position.y + spd }))
            break
        case '6_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x - spd }))
            break
        case '5_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x - spd, y: that.position.y + spd }))
            break
        case '3_run':
            that.addPosition(Object.assign(oldPosition, { x: that.position.x + spd, y: that.position.y + spd }))
            break
        default: () => {}
    }
}


/**
 * basic interface info
 */
export const createName = function() {
    return [{
        position: 'absolute', // position attr : fixed | abosolute | alignCenter | default === absolute,
        modal: 'div',
        initOrigin: () => {
            return [this.position.x - 20, this.position.y - 120]
        },
        borderStyle: {
            width: 0,
            color: '#fff',
        },
        layoutInfo: {
            left: 0,
            top: 0,
            width: 40,
            height: 14,
        },
        child: [{
            position: 'alignCenter',
            modal: 'font',
            content: this.state.name,
            layoutInfo: {
                fontSize: 12,
                letterSpacing: 0,
            }
        }]
    }]
}

export const showHp = function() {
    return [{
        position: 'absolute', // position attr : fixed | abosolute | alignCenter | default === absolute,
        modal: 'div',
        initOrigin: () => {
            return [this.position.x - 20, this.position.y - 80]
        },
        borderStyle: {
            width: 1,
            color: '#fff',
        },
        layoutInfo: {
            left: 0,
            top: 0,
            width: 35,
            height: 6,
        },
        child: [{
            position: 'alignCenter',
            modal: 'hp',
            getContent: () => {
                return {
                    maxHp: this.state.maxHp,
                    hp: this.state.hp,
                }
            },
            layoutInfo: {
                width: 35,
                height: 6,
                fontSize: 10,
            }
        }]
    }]
}


/**
 * materials info
 */
export const materials = {
    // 小红瓶
    '0001': {
        role: {
            logo: '1.png',
            isSprite: true,
            isMonster: false,
            recoverAmount: 1/3,
            maxRecoverKey: 'maxHp', 
            recoverKey: 'hp',
        },
        onCrash: recoverStateFunc
    },
    // 中红瓶
    '0002': {
      role: {
          logo: '2.png',
          isSprite: true,
          isMonster: false,
          recoverAmount: 2/3,
          maxRecoverKey: 'maxHp', 
          recoverKey: 'hp',
      },
      onCrash: recoverStateFunc
    },
    // 大红瓶
    '0003': {
      role: {
          logo: '3.png',
          isSprite: true,
          isMonster: false,
          recoverAmount: 3/3,
          maxRecoverKey: 'maxHp', 
          recoverKey: 'hp',
      },
      onCrash: recoverStateFunc
    },
    // 小蓝瓶
    '0004': {
      role: {
          logo: '4.png',
          isSprite: true,
          isMonster: false,
          recoverAmount: 1/3,
          maxRecoverKey: 'maxMp', 
          recoverKey: 'mp',
      },
      onCrash: recoverStateFunc
    },
    // 中蓝瓶
    '0005': {
      role: {
          logo: '5.png',
          isSprite: true,
          isMonster: false,
          recoverAmount: 2/3,
          maxRecoverKey: 'maxMp', 
          recoverKey: 'mp',
      },
      onCrash: recoverStateFunc
    },
    // 大蓝瓶
    '0006': {
      role: {
          logo: '6.png',
          isSprite: true,
          isMonster: false,
          recoverAmount: 3/3,
          maxRecoverKey: 'maxMp', 
          recoverKey: 'mp',
      },
      onCrash: recoverStateFunc
    },
     // 小蓝瓶
     '0007': {
      role: {
          logo: 'h7.png',
          isSprite: true,
          isMonster: false
      }
    },
    // 中蓝瓶
    '0008': {
      role: {
          logo: '1018.png',
          isSprite: true,
          isMonster: false
      }
    },
    // 大蓝瓶
    '0009': {
      role: {
          logo: '1017.png',
          isSprite: true,
          isMonster: false
      }
    },
    // 大蓝瓶
    '0010': {
      role: {
          logo: 'b10083.png',
          isSprite: true,
          isMonster: false
      }
    },
    // 大蓝瓶
    '0011': {
      role: {
          logo: 'b10084.png',
          isSprite: true,
          isMonster: false
      }
    },
    '1003': {
      role: {
        logo: 'b10087.png',
        isSprite: true,
        isMonster: false
      }
    },
    // 金币卡片
    'b10087': {
      role: {
        logo: 'b10087.png',
        isSprite: true,
        isMonster: false
      }
    },
    // 金币掉落形态
    'g_icon_money4': {
      role: {
          logo: 'g_icon_money4.png',
          isSprite: true,
          isMonster: false,
          name: "金币",
          desc: "掉落的金币, 为什么怪物会掉落金币呢, 这至今是个谜。"
      },
      onCrash: function () {
        const [self, crashItem] = arguments
        if (crashItem.state.isHero) { // 金币可以被hero拾取
          window.__game.removeMonster(self)
          // hero 属性中金币添加对应数量
       
        }
      }
    },
    // 斧子掉落形态
    'g_icon_1001': {
      role: {
        logo: 'g_icon_1001.png',
        isSprite: true,
        isMonster: false
      }
    },
     // 扇子掉落形态
    'g_icon_1003': {
      role: {
          logo: 'g_icon_1003.png',
          isSprite: true,
          isMonster: false
      }
    },
    // 红色大保健掉落形态
    'g_icon_1004': {
      role: {
          logo: 'g_icon_1004.png',
          isSprite: true,
          isMonster: false
      }
    },
    // 黄色大保健掉落形态
    'g_icon_1005': {
      role: {
        logo: 'g_icon_1005.png',
        isSprite: true,
        isMonster: false
      }
    },
    // 蓝色三角圆球
    'b10041': {
      role: {
          logo: 'b10041.png',
          isSprite: true,
          isMonster: false
      }
    },
    // 绿色三角圆球
    'b10042': {
      role: {
          logo: 'b10042.png',
          isSprite: true,
          isMonster: false
      }
    },
    // 十字圆球章
    'b10043': {
      role: {
        logo: 'b10043.png',
        isSprite: true,
        isMonster: false
      }
    },
    '1027': {
      role: {
        logo: '1027.png',
        isSprite: true,
        isMonster: false
      }
    },
    '1028': {
      role: {
        logo: '1028.png',
        isSprite: true,
        isMonster: false
      }
    },
}

