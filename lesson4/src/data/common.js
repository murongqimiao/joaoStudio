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
        '_role_001_0_stand_0 | 0 | 0 | 57 | 81 | 29 | 81 | turnX | 9 | 5 | 10 | 47 | 71',
        '_role_001_0_stand_1 | 0 | 0 | 57 | 81 | 29 | 81 | turnX | 9 | 5 | 10 | 47 | 71',
        '_role_001_0_stand_2 | 0 | 0 | 57 | 81 | 29 | 81 | turnX | 9 | 5 | 10 | 47 | 71',
    ],
    '6_stand': [
        '_role_001_0_stand_0 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 5 | 10 | 47 | 71',
        '_role_001_0_stand_1 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 5 | 10 | 47 | 71',
        '_role_001_0_stand_2 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 5 | 10 | 47 | 71',
    ],
    '2_run': [
        '_role_001_6_run_0 | 0 | 0 | 57 | 81 | 29 | 81 | turnX | 9 | 5 | 10 | 47 | 71',
        '_role_001_6_run_1 | 0 | 0 | 57 | 81 | 29 | 81 | turnX | 9 | 5 | 10 | 47 | 71',
        '_role_001_6_run_2 | 0 | 0 | 57 | 81 | 29 | 81 | turnX | 9 | 5 | 10 | 47 | 71',
        '_role_001_6_run_3 | 0 | 0 | 57 | 81 | 29 | 81 | turnX | 9 | 5 | 10 | 47 | 71',
    ],
    '6_run': [
        '_role_001_6_run_0 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 5 | 10 | 47 | 71',
        '_role_001_6_run_1 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 5 | 10 | 47 | 71',
        '_role_001_6_run_2 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 5 | 10 | 47 | 71',
        '_role_001_6_run_3 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 5 | 10 | 47 | 71',
    ],
    '2_jump': [
        '_role_001_6_jump_0 | 0 | 0 | 57 | 81 | 29 | 81 | turnX | 9 | 5 | 10 | 47 | 71',
    ],
    '6_jump': [
        '_role_001_6_jump_0 | 0 | 0 | 57 | 81 | 29 | 81 | null | 9 | 5 | 10 | 47 | 71',
    ],
    '6_attack': [
        '_role_001_6_attack_0 | 0 | 0 | 62 | 77 | 31 | 77 | null | 15 | 5 | 10 | 52 | 67',
        '_role_001_6_attack_1 | 0 | 0 | 57 | 80 | 28 | 80 | null | 15 | 5 | 10 | 47 | 70',
        '_role_001_6_attack_2 | 0 | 0 | 72 | 74 | 36 | 74 | null | 15 | 5 | 10 | 52 | 64',
    ],
    '2_attack': [
        '_role_001_6_attack_0 | 0 | 0 | 62 | 77 | 31 | 77 | turnX | 15 | 5 | 10 | 52 | 67',
        '_role_001_6_attack_1 | 0 | 0 | 57 | 80 | 28 | 80 | turnX | 15 | 5 | 10 | 47 | 70',
        '_role_001_6_attack_2 | 0 | 0 | 72 | 74 | 36 | 74 | turnX | 15 | 5 | 10 | 52 | 64',
    ],
    '2_down': [
        '_role_001_6_down_0 | 0 | 0 | 71 | 53 | 35 | 53 | turnX | 15 | 5 | 10 | 61 | 43',
    ],
    '6_down': [
        '_role_001_6_down_0 | 0 | 0 | 71 | 53 | 35 | 53 | null | 15 | 5 | 10 | 61 | 43',
    ],
}

export const backgroundImageInfo = {
    // name | _offsetLeft | _offsetTop | width | height 
    'villageBrickCenter01': '_map_wm_wm00001 | 0 | 0 | 90 | 60',
    'villageBrickCenter02': '_map_wm_wm00002 | 0 | 0 | 90 | 60',
    'villageBrickCenter03': '_map_wm_wm00003 | 0 | 0 | 90 | 60',
    'villageBrickCenter04': '_map_wm_wm00004 | 0 | 0 | 90 | 60',
    'villageBrickCenter05': '_map_wm_wm00005 | 0 | 0 | 90 | 60',
    'villageBrickLeft01': '_map_wsl_wsl00001 | | 0 | 0 | 30 | 60',
    'villageBrickLeft02': '_map_wsl_wsl00002 | 0 | 0 | 30 | 60',
    'villageBrickRight01': '_map_wsr_wsr00001 | 0 | 0 | 30 | 60',
    'villageBrickRight01': '_map_wsr_wsr00002 | 0 | 0 | 30 | 60',

}


export const frontImageInfo = {
    // name | _offsetLeft | _offsetTop | width | height 
    'villageGrass01': '_map_ft_ft00001 | 0 | 0 | 54 | 37',
    'villageGrass02': '_map_ft_ft00002 | 0 | 0 | 55 | 37',
    'villageGrass03': '_map_ft_ft00003 | 0 | 0 | 45 | 37',
    'villageGrass04': '_map_ft_ft00004 | 0 | 0 | 45 | 37',
    'villageGrassSlant01': '_map_fst_fst00001 | 0 | 0 | 90 | 90', // 向右上方走
    'villageGrassSlant02': '_map_fst_fst00002 | 0 | 0 | 90 | 90', // 向左上方走
}
