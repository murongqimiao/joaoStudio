/**
 * generate by cq resource
 */
export const CONSTANT_COMMON = {
    COMMON_IMG_SIZE: {
        new_dco004: '203_227',
        new_dco005: '199_234',
        new_ms001: '152_178',
        new_ms002: '224_245'
    },
    COMMON_VOLUME_SIZE: {
        new_dco004: '75_85_40_40_1',
        new_dco005: '80_40_20_20_1',
        new_ms001: '60_85_35_35_1',
        new_ms002: '80_40_20_20_1'
    },
    COMMON_ORIGIN_CENTER: {
        new_dco004: '95_125',
        new_dco005: '100_117',
        new_ms001: '78_120',
        new_ms002: '110_120'
    },
    BASE_HERO_HP: 3,
    BASE_HERO_ATK: 1,
    BASE_HERO_DEF: 0,
    BASE_HERO_MAGIC: 3,
    BASE_HERO_SPD: 2,
    BASE_ONE_SECOND: 60,
    DPR: 3,
    INFINITY: 999999999,
}

// current available img
const CONSTANT_IMG = {
    new_dco004: 'new_dco004',
    new_dco005: 'new_dco005',
    new_ms001: 'new_ms001',
    new_ms002: 'new_ms002'
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
    const defaultComputedKey = ['attack', 'death', 'hit', 'skill', 'stand', 'run']
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
                    frameItem.push({
                        name: _name,
                        frameStayTime,
                        volumeInfo,
                        centerOrigin,
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
        name: "new_dco004",
        des: "user control human description",
        hp: CONSTANT_COMMON.BASE_HERO_HP,
        atk: CONSTANT_COMMON.BASE_HERO_ATK,
        def: CONSTANT_COMMON.BASE_HERO_DEF,
        spd: CONSTANT_COMMON.BASE_HERO_SPD,
        isSolid: true,
        isHero: true,
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
        atk: CONSTANT_COMMON.BASE_HERO_ATK,
        def: CONSTANT_COMMON.BASE_HERO_DEF,
        spd: CONSTANT_COMMON.BASE_HERO_SPD,
        isSolid: true,
        isHero: true,
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
        defaultEvent: '0_stand'
    },
    skill: {
        cd: CONSTANT_COMMON.BASE_ONE_SECOND
    },
    zIndex: 10,
    // 图片渲染的优化方向, 提供一个使用大图的高宽及横纵下标返回图片的能力
  
    framesList: generateFrameList({
        name: 'new_ms001',
        type: 'monster',
        attackTime: 6,
        attackFrame: 5,
        deathTime: 3,
        deathFrame: 5,
        hitTime: 2,
        hitFrame: 5,
        skillTime: 6,
        skillFrame: 5,
        standTime: 3,
        standFrame: 20,
        runTime: 7,
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
    }
}

/**
 * action info {}
 * 
 */
 export const walking = function (game) {
    const { spd } = this.state;
    const oldPosition = JSON.parse(JSON.stringify(this.position))
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
        const check = (list) => {
            return list.map(v => computedKeyList.includes(v)).every(v => v)
        }
        const hasInBuffer = (list) => {
            return list.map(v => computedKeyListBuffer.includes(v)).some(v => v)
        }
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
    switch (direct) {
        case '0_run':
            this.addPosition(Object.assign(oldPosition, { y: this.position.y - spd }))
            break
        case '1_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x + spd, y: this.position.y - spd }))
            break
        case '7_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x - spd, y: this.position.y - spd }))
            break
        case '2_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x + spd }))
            break
        case '4_run':
            this.addPosition(Object.assign(oldPosition, { y: this.position.y + spd }))
            break
        case '6_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x - spd }))
            break
        case '5_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x - spd, y: this.position.y + spd }))
            break
        case '3_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x + spd, y: this.position.y + spd }))
            break
        case '0_run':
            this.addPosition(Object.assign(oldPosition, { y: this.position.y - spd * 2 }))
            break
        case '1_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x + spd * 2, y: this.position.y - spd * 2 }))
            break
        case '7_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x - spd * 2, y: this.position.y - spd * 2 }))
            break
        case '2_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x + spd * 2 }))
            break
        case '4_run':
            this.addPosition(Object.assign(oldPosition, { y: this.position.y + spd * 2 }))
            break
        case '6_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x - spd * 2 }))
            break
        case '5_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x - spd * 2, y: this.position.y + spd * 2 }))
            break
        case '3_run':
            this.addPosition(Object.assign(oldPosition, { x: this.position.x + spd * 2, y: this.position.y + spd * 2 }))
            break
        default: () => {}
    }


    return this;
}