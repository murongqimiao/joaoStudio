export const CONSTANT_COMMON = {
    BASE_HERO_HP: 3,
    BASE_HERO_ATK: 1,
    BASE_HERO_DEF: 0,
    BASE_HERO_MAGIC: 3,
    BASE_HERO_SPD: 1,
    BASE_ONE_SECOND: 60,
    DPR: 3,
}

const CONSTANT_IMG = {
    FOOT_MAN_WALKING: 'FOOT_MAN_WALKING', // 图片位置
    FOOT_MAN_WALKING_SIZE: '1024_1024', // 图片尺寸
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
        name: "福特曼",
        des: "一个普通的脚男,出身卑微,生活困苦",
        hp: CONSTANT_COMMON.BASE_HERO_HP,
        atk: CONSTANT_COMMON.BASE_HERO_ATK,
        def: CONSTANT_COMMON.BASE_HERO_DEF,
        spd: CONSTANT_COMMON.BASE_HERO_SPD
    },
    skill: {
        cd: CONSTANT_COMMON.BASE_ONE_SECOND
    },
    // 图片渲染的优化方向, 提供一个使用大图的高宽及横纵下标返回图片的能力
    framePerChange: {
        TOP: 10,
        TOP_LEFT: 10,
        TOP_RIGHT: 10,
        LEFT: 10,
        RIGHT: 10,
        BOTTOM: 10,
        BOTTOM_LEFT: 10,
        BOTTOM_RIGHT: 10
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
    },
    onHeroAdd: function () {
        const [game, self] = arguments
        console.log("大敌当前,十分恐惧, hp-1")
        self.state.hp--
        console.log(self)
    }
}


/**
 * action info {}
 * 
 */
export const walking = function () {
    // console.log("执行了walking")
    // console.log(this)
    this.curEvent = 'RIGHT'
    return this;
}
