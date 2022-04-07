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
 * 参数参考  name 图片名称 | _offsetLeft 读取取值距离左侧 | _offsetTop 读图距离顶部  | toWidth 绘制时宽 | toHeight 绘制时高 | volumeWidth 体积宽  | volueHeight 体积高 | volume offset left 体积距离图片左侧 | volue offset top 体积距离图片顶部 | center x 实际站位点距离图片左侧  | center y 实际站位点距离顶部  | volumeshape 体积形状  | transform 图像变换 | frames 每张图持续几帧
 */

export const imgInfo = {
    // name | _offsetLeft | _offsetTop | toWidth| toHeight | volumeWidth | volumeHeight | volumeOffsetLEft | volumeOffsetTop | centerLeft | centerTop | volumeShape | transoform  共13项 | frames 每张图持续几帧
    '2_stand': [
        '0_stand_0.png | 0 | 0 | 57 | 81 | 57 | 81 | 0 | 0 | 29 | 81 | rectangle | turnX(50%, 50%) | 5',
        '0_stand_1.png | 0 | 0 | 57 | 81 | 57 | 81 | 0 | 0 | 29 | 81 | rectangle | turnX(50%, 50%) | 5',
        '0_stand_2.png | 0 | 0 | 57 | 81 | 57 | 81 | 0 | 0 | 29 | 81 | rectangle | turnX(50%, 50%) | 5',
    ],
    '6_stand': [
        '0_stand_0.png | 0 | 0 | 57 | 81 | 57 | 81 | 0 | 0 | 29 | 81 | rectangle | null | 5',
        '0_stand_1.png | 0 | 0 | 57 | 81 | 57 | 81 | 0 | 0 | 29 | 81 | rectangle | null | 5',
        '0_stand_2.png | 0 | 0 | 57 | 81 | 57 | 81 | 0 | 0 | 29 | 81 | rectangle | null | 5',
    ],
    '2_run': [
        '6_run_0.png | 0 | 0 | 57 | 80 | 57 | 80 | 0 | 0 | 29 | 80 | rectangle | turnX(50%, 50%) | 5',
        '6_run_1.png | 0 | 0 | 57 | 81 | 57 | 81 | 0 | 0 | 29 | 80 | rectangle | turnX(50%, 50%) | 5',
        '6_run_2.png | 0 | 0 | 57 | 80 | 57 | 80 | 0 | 0 | 29 | 80 | rectangle | turnX(50%, 50%) | 5',
        '6_run_3.png | 0 | 0 | 57 | 81 | 57 | 81 | 0 | 0 | 29 | 80 | rectangle | turnX(50%, 50%) | 5',
    ],
    '6_run': [
        '6_run_0.png | 0 | 0 | 57 | 80 | 57 | 80 | 0 | 0 | 29 | 80 | rectangle | null | 5',
        '6_run_1.png | 0 | 0 | 57 | 81 | 57 | 81 | 0 | 0 | 29 | 80 | rectangle | null | 5',
        '6_run_2.png | 0 | 0 | 57 | 80 | 57 | 80 | 0 | 0 | 29 | 80 | rectangle | null | 5',
        '6_run_3.png | 0 | 0 | 57 | 81 | 57 | 81 | 0 | 0 | 29 | 80 | rectangle | null | 5',
    ]

}