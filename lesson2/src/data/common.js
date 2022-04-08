/**
 * 初始通用数据存放
 */
export const CONSTANT_COMMON = {
    COMMON_IMG_SIZE: {
        new_dco004: '203_227',
    },
    COMMON_VOLUME_SIZE: {
        new_dco004: '75_85_40_40_1',
    },
    COMMON_ORIGIN_CENTER: {
        new_dco004: '95_125',
    },
    SKILL_POSITION: { // 技能位置相对于人物当前方向的位移
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

/**
 * 参数参考  name 图片名称 | _offsetLeft 读取取值距离左侧 | _offsetTop 读图距离顶部  | toWidth 绘制时宽 | toHeight 绘制时高 | center x 实际站位点距离图片左侧  | center y 实际站位点距离顶部 | transform 图像变换 | frames 每张图持续几帧
 */

export const imgFrameInfo = {
    // name | _offsetLeft | _offsetTop | toWidth| toHeight | centerLeft | centerTop| transoform  共13项 | frames 每张图持续几帧 | 体积距离左侧 volumeOffsetLeft | 体积距离顶部 volumeOffsetTop | volumeWidth 体积宽  | volumeHeight 体积高
    '2_stand': [
        '_role_001_0_stand_0 | 0 | 0 | 57 | 81 | 29 | 81 | turnX(50%, 50%) | 9 | 5 | 10 | 47 | 71',
        '_role_001_0_stand_1 | 0 | 0 | 57 | 81 | 29 | 81 | turnX(50%, 50%) | 9 | 5 | 10 | 47 | 71',
        '_role_001_0_stand_2 | 0 | 0 | 57 | 81 | 29 | 81 | turnX(50%, 50%) | 9 | 5 | 10 | 47 | 71',
    ],
    '6_stand': [
        '_role_001_0_stand_0 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 0 | 0 | 57 | 81',
        '_role_001_0_stand_1 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 0 | 0 | 57 | 81',
        '_role_001_0_stand_2 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 0 | 0 | 57 | 81',
    ],
    '2_run': [
        '_role_001_6_run_0 | 0 | 0 | 57 | 80 | 29 | 80 | turnX(50%, 50%) | 9 | 0 | 0 | 57 | 81',
        '_role_001_6_run_1 | 0 | 0 | 57 | 81 | 29 | 80 | turnX(50%, 50%) | 9 | 0 | 0 | 57 | 81',
        '_role_001_6_run_2 | 0 | 0 | 57 | 80 | 29 | 80 | turnX(50%, 50%) | 9 | 0 | 0 | 57 | 81',
        '_role_001_6_run_3 | 0 | 0 | 57 | 81 | 29 | 80 | turnX(50%, 50%) | 9 | 0 | 0 | 57 | 81',
    ],
    '6_run': [
        '_role_001_6_run_0 | 0 | 0 | 57 | 80 | 29 | 80 | null | 9 | 0 | 0 | 57 | 81',
        '_role_001_6_run_1 | 0 | 0 | 57 | 81 | 29 | 80 | null | 9 | 0 | 0 | 57 | 81',
        '_role_001_6_run_2 | 0 | 0 | 57 | 80 | 29 | 80 | null | 9 | 0 | 0 | 57 | 81',
        '_role_001_6_run_3 | 0 | 0 | 57 | 81 | 29 | 80 | null | 9 | 0 | 0 | 57 | 81',
    ]

}