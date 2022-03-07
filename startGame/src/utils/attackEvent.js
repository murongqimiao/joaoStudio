export const attackEvent = function (HitObj, BeHitObj, type) {
    if (type === 'normal') {
        try {
            const damage = HitObj.state.atk - BeHitObj.state.def > 0 ? HitObj.state.atk - BeHitObj.state.def : 0 // computed damage
            BeHitObj.state.hp -= damage
            if (BeHitObj.state.hp < 0 || BeHitObj.state.hp === 0) { // trigger dead event
                BeHitObj.Death()
                if (BeHitObj.state.isMonster) {
                    BeHitObj.addFrameEndEvent(function() {
                        this.delete = true
                        window.__game.removeMonster(BeHitObj)
                    }.bind(BeHitObj))
                }
            }
        } catch (err) {
            console.log("=========执行attack event失败=========", err)
        }
    }
}