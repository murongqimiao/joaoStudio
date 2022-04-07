export const role01 = {
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