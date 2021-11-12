const CONSTANT_COMMON = {
    BASE_HERO_HP: 3,
    BASE_HERO_ATK: 1,
    BASE_HERO_DEF: 0,
    BASE_HERO_MAGIC: 3,
    BASE_HERO_SPD: 1,
    BASE_ONE_SECOND: 60,
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
    onHeroAdd: function () {
        const [game, self] = arguments
        console.log("大敌当前,十分恐惧, hp-1")
        self.state.hp--
        console.log(self)
    }
}