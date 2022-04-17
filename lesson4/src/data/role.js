/**
 * 角色类信息
 */
import { generateFrameList } from "../utils/handleImage"
import { imgFrameInfo, CONSTANT_COMMON } from "./common"

export const role01 = {
    state: {
        id: '001',
        name: "主角abc",
        des: "user control human description",
        hp: CONSTANT_COMMON.BASE_HERO_HP,
        atk: CONSTANT_COMMON.BASE_HERO_ATK,
        def: CONSTANT_COMMON.BASE_HERO_DEF,
        spd: CONSTANT_COMMON.BASE_HERO_SPD,
        isHero: true,
        maxHp:  CONSTANT_COMMON.BASE_HERO_HP,
        jumpDuration: 1, // 跳跃浮空时间
        jumpTime: 1, // 可跳跃次数
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
        defaultEvent: '2_stand'
    },
    skill: {
        cd: CONSTANT_COMMON.BASE_ONE_SECOND
    },
    zIndex: 10,
    // 图片渲染的优化方向, 提供一个使用大图的高宽及横纵下标返回图片的能力
  
    framesList: {
        '2_stand': generateFrameList(imgFrameInfo['2_stand']),
        '6_stand': generateFrameList(imgFrameInfo['6_stand']),
        '2_run': generateFrameList(imgFrameInfo['2_run']),
        '6_run': generateFrameList(imgFrameInfo['6_run']),
        '2_jump': generateFrameList(imgFrameInfo['2_jump']),
        '6_jump': generateFrameList(imgFrameInfo['6_jump']),
        '2_attack': generateFrameList(imgFrameInfo['2_attack']),
        '6_attack': generateFrameList(imgFrameInfo['6_attack']),
        '2_down': generateFrameList(imgFrameInfo['2_down']),
        '6_down': generateFrameList(imgFrameInfo['6_down']),
    },
    // 首次添加时执行
    onAdded: function () { 
        const [game, self] = arguments
        self.curEvent = self.state.defaultEvent
    },
    onCrash: function () {
        const [self, crashItem] = arguments
        console.log("======self=========", self)
        console.log("======crashItem=========", crashItem)
        // if (crashItem.state.isSolid) {
        //     if (self.curRender.lastFrame) {
        //         this.position.x = self.curRender.lastFrame.x1
        //         this.position.y = self.curRender.lastFrame.y1
        //     }
        // }
    }
}