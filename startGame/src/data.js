export const CONSTANT_COMMON = {
    BASE_HERO_HP: 3,
    BASE_HERO_ATK: 1,
    BASE_HERO_DEF: 0,
    BASE_HERO_MAGIC: 3,
    BASE_HERO_SPD: 4,
    BASE_ONE_SECOND: 60,
    DPR: 3,
    INFINITY: 999999999,
}

const CONSTANT_IMG = {
    FOOT_MAN_WALKING: 'FOOT_MAN_WALKING', // 图片位置
    FOOT_MAN_WALKING_SIZE: '1024_1024', // 图片尺寸
    GOLD_COIN_IN_MAP: 'GOLD_COIN_IN_MAP',
    GOLD_COIN_IN_MAP_SIZE: '256_128',
    FOOT_MAN_RUN: 'FOOT_MAN_RUN',
    FOOT_MAN_RUN_SIZE: '1024_1024',
}

const goods = {
    gold: {
        id: 1,
        name: 'gold',
        description: 'A precious matel.'
    }
}

export const getImageFromX_Y = (imgClass, X_Y) => {
    // 1_1_8_8 表示图片是8X8, imgClass找对应图片size, 除以即可 抛出结果, 
    const imgSize = CONSTANT_IMG[imgClass + '_SIZE']
    const [imgWidth, imgHeight] = imgSize.split('_')
    const [colNth, rowNth, rowMax, colMax] = X_Y.split('_')
    const perRow = imgWidth / rowMax
    const perCol = imgHeight / colMax
    return {
        sx: (rowNth - 1) * perRow,
        sy: (colNth - 1) * perCol,
        swidth: perRow,
        sheight: perCol,
        width: perRow,
        height: perCol
    }
}

/**
 * hero info  {}
 *      [role, skill]
 *      role {}
 *          [name, des, hp, atk, def, magic, spd]
 *      skill {}
 *          [cd]
 */
export const footMan = {
    role: {
        id: 1,
        name: "福特曼",
        des: "一个普通的脚男,出身卑微,生活困苦",
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
        }]
    },
    skill: {
        cd: CONSTANT_COMMON.BASE_ONE_SECOND
    },
    zIndex: 10,
    // 图片渲染的优化方向, 提供一个使用大图的高宽及横纵下标返回图片的能力
    framePerChange: {
        TOP: 5,
        TOP_LEFT: 5,
        TOP_RIGHT: 5,
        LEFT: 5,
        RIGHT: 5,
        BOTTOM: 5,
        BOTTOM_LEFT: 5,
        BOTTOM_RIGHT: 5,
        TOP_RUN: 5,
        TOP_LEFT_RUN: 5,
        TOP_RIGHT_RUN: 5,
        LEFT_RUN: 5,
        RIGHT_RUN: 5,
        BOTTOM_RUN: 5,
        BOTTOM_LEFT_RUN: 5,
        BOTTOM_RIGHT_RUN: 5
    },
    framesList: {
        TOP: [{ imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '3_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '3_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '3_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '3_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '3_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '3_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '3_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '3_8_8_8' }],
        TOP_LEFT: [{ imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '2_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '2_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '2_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '2_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '2_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '2_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '2_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '2_8_8_8' }],
        TOP_RIGHT: [{ imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '4_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '4_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '4_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '4_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '4_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '4_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '4_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '4_8_8_8' }],
        LEFT: [{ imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '1_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '1_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '1_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '1_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '1_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '1_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '1_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '1_8_8_8' }],
        RIGHT: [{ imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '5_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '5_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '5_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '5_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '5_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '5_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '5_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '5_8_8_8' }],
        BOTTOM: [{ imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '7_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '7_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '7_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '7_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '7_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '7_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '7_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '7_8_8_8' }],
        BOTTOM_LEFT: [{ imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '8_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '8_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '8_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '8_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '8_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '8_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '8_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '8_8_8_8' }],
        BOTTOM_RIGHT: [{ imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '6_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '6_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '6_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '6_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '6_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '6_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '6_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '6_8_8_8' }],
        TOP_RUN: [{ imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '3_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '3_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '3_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '3_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '3_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '3_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '3_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '3_8_8_8' }],
        TOP_LEFT_RUN: [{ imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '2_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '2_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '2_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '2_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '2_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '2_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '2_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '2_8_8_8' }],
        TOP_RIGHT_RUN: [{ imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '4_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '4_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '4_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '4_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '4_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '4_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '4_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '4_8_8_8' }],
        LEFT_RUN: [{ imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '1_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '1_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '1_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '1_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '1_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '1_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '1_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '1_8_8_8' }],
        RIGHT_RUN: [{ imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '5_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '5_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '5_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '5_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '5_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '5_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '5_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '5_8_8_8' }],
        BOTTOM_RUN: [{ imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '7_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '7_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '7_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '7_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '7_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '7_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '7_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '7_8_8_8' }],
        BOTTOM_LEFT_RUN: [{ imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '8_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '8_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '8_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '8_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '8_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '8_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '8_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '8_8_8_8' }],
        BOTTOM_RIGHT_RUN: [{ imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '6_1_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '6_2_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '6_3_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '6_4_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '6_5_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '6_6_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '6_7_8_8' }, { imgClass: CONSTANT_IMG.FOOT_MAN_RUN, imgLR: '6_8_8_8' }],
        DEFAULT: [{ imgClass: CONSTANT_IMG.FOOT_MAN_WALKING, imgLR: '7_1_8_8' }]
    },
    onHeroAdd: function () {
        const [game, self] = arguments
        self.state.hp--
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
 * monster info  {}
 *      [role, skill]
 *      role {}
 *          [name, des, hp, atk, def, magic, spd]
 *      skill {}
 *          [cd]
 */
export const goldCoinInMap = {
    role: {
        name: "金币",
        id: 2,
        des: "财富的象征, 世人匆匆忙忙, 不过图碎银几两~",
        hp: CONSTANT_COMMON.INFINITY,
        atk: CONSTANT_COMMON.INFINITY,
        def: CONSTANT_COMMON.INFINITY,
        spd: CONSTANT_COMMON.INFINITY,
        volumeInfo: {
            shape: 'circle',
            r: 10,
            solid: false,
            codeDown: 60, // 碰撞cd时间
            once: true,
            occur: false
        }
    },
    skill: {
        cd: CONSTANT_COMMON.BASE_ONE_SECOND
    },
    framePerChange: {
        SPIN: 5,
        DEAD: 1
    },
    framesList: {
        SPIN: [{ imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_1_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_2_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_3_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_4_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_5_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_6_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_7_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_8_8_4' },
        { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_1_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_2_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_3_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_4_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_5_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_6_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_7_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_8_8_4' }],
        DEAD: [{ imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_1_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_2_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_3_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_4_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_5_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_6_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_7_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '3_8_8_4' },
        { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_1_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_2_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_3_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_4_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_5_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_6_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_7_8_4' }, { imgClass: CONSTANT_IMG.GOLD_COIN_IN_MAP, imgLR: '2_8_8_4' }]
    },
    zIndex: 9,
    onMonsterAdd: function () {
        const [game, self] = arguments
        // self.curEvent = 'SPIN'
        console.log("load gold coin, 并执行SPIN行为")
        this.curEvent = 'SPIN'
    },
    onCrash: function () {
        const [self, crashItem, game] = arguments
        if (crashItem.state.isHero) {
            if (self.state.volumeInfo.occur) return
            this.initFrameInfo('DEAD')
            self.state.volumeInfo.occur = true
            self.nextFrameEndEvent = (self.nextFrameEndEvent || []).concat(this.onDead.bind(self, crashItem, game))
            crashItem.KnapsackGetSth(1, 1)
            let _p = document.createElement('p')
            _p.innerHTML = `${crashItem.state.name}获得了${1}枚${self.state.name}`
            document.getElementById('log-area').appendChild(_p)

            setTimeout(() => {
                [0, 1, 3].forEach(item => {
                    let newCoin = new window.__Role(window.__monsterList[self.state.id])
                    newCoin.state.volumeInfo.occur = false
                    newCoin.state.volumeInfo.occur = false
                    newCoin.addPosition({ x: Math.floor(Math.random() * 1000), y: Math.floor(Math.random() * 400), z: 0, yRegression: 5 })
                    window.__game.addNewMonster(newCoin)
                })
            }, 500)
        }
    },
    onDead: function () {
        const [crashItem, game] = arguments
        this.delete = true
    }
}


/**
 * action info {}
 * 
 */
export const walking = function (game) {
    const { spd } = this.state;
    this.oldPosition = JSON.parse(JSON.stringify(this.position)) // 缓存本步骤
    // console.log("spd", spd)
    let direct = 'DEFAULT'
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
            direct = 'TOP_LEFT' + (hasInBuffer(['J', 'I']) ? '_RUN' : '')
        } else if (check(['I', 'L'])) {
            direct = 'TOP_RIGHT' + (hasInBuffer(['I', 'L']) ? '_RUN' : '')
        } else if (check(['J', 'K'])) {
            direct = 'BOTTOM_LEFT' + (hasInBuffer(['J', 'K']) ? '_RUN' : '')
        } else if (check(['K', 'L'])) {
            direct = 'BOTTOM_RIGHT' + (hasInBuffer(['K', 'L']) ? '_RUN' : '')
        } else if (check(['I'])) {
            direct = 'TOP' + (hasInBuffer(['I']) ? '_RUN' : '')
        } else if (check(['J'])) {
            direct = 'LEFT' + (hasInBuffer(['J']) ? '_RUN' : '')
        } else if (check(['K'])) {
            direct = 'BOTTOM' + (hasInBuffer(['K']) ? '_RUN' : '')
        } else if (check(['L'])) {
            direct = 'RIGHT' + (hasInBuffer(['L']) ? '_RUN' : '')
        }
    }
    if (direct !== this.curEvent) {
        // 更换动作需要初始化的帧动画
        this.curRender.curFrameImgIndex = 0
        this.curRender.curFrame = 0
    }
    if (direct !== 'DEFAULT') {
        this.curEvent = direct
    }
    switch (direct) {
        case 'TOP': this.position.y -= spd;
            break
        case 'TOP_RIGHT': this.position.x += spd
            this.position.y -= spd
            break
        case 'TOP_LEFT':
            this.position.x -= spd
            this.position.y -= spd
            break
        case 'RIGHT': this.position.x += spd
            break
        case 'BOTTOM': this.position.y += spd
            break
        case 'LEFT': this.position.x -= spd
            break
        case 'BOTTOM_LEFT': this.position.x -= spd
            this.position.y += spd
            break
        case 'BOTTOM_RIGHT': this.position.x += spd
            this.position.y += spd
            break
        case 'TOP_RUN': this.position.y -= spd;
            break
        case 'TOP_RIGHT_RUN': this.position.x += spd
            this.position.y -= spd
            break
        case 'TOP_LEFT_RUN':
            this.position.x -= spd
            this.position.y -= spd
            break
        case 'RIGHT_RUN': this.position.x += spd
            break
        case 'BOTTOM_RUN': this.position.y += spd
            break
        case 'LEFT_RUN': this.position.x -= spd
            break
        case 'BOTTOM_LEFT_RUN': this.position.x -= spd
            this.position.y += spd
            break
        case 'BOTTOM_RIGHT_RUN': this.position.x += spd
            this.position.y += spd
            break
        default: this.curEvent = 'DEFAULT'
    }


    return this;
}
