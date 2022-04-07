
import { loadInitResources } from "./utils/resources"

const drawFPS = function (ctx, gameFPS) {
    ctx.font = '20px Arial'
    ctx.fillStyle = '#fff'
    let FPSText = 'FPS:  ' + gameFPS
    ctx.direction = 'ltr'
    ctx.fillText(FPSText, 10, 20)
}

const drawHelloWorld = function (ctx, position) {
    const { x, y, directionRight, directionBottom } = position
    ctx.font = '24px Arial'
    ctx.fillStyle = '#3072f6'
    ctx.direction = 'ltr'
    ctx.fillText('hello world', position.x, position.y)
    if (directionRight) { position.x += 3 } else { position.x -= 3 }
    if (directionBottom) { position.y += 1 } else { position.y -= 1 }
    if (x > 1000) {
        position.directionRight = false
    } else if (x < 0) {
        position.directionRight = true
    }
    if (y > 600) {
        position.directionBottom = false
    } else if (y < 20) {
        position.directionBottom = true
    }
}

class Game {
    roleList = []
    environmentList = [] // 环境资源
    allRenderList = [] 
    keyCollect = [] // 当前活跃的按键
    keyCollectBuffer = [] // 活跃过的按键在缓冲区待一阵
    debug = 1
    gameFPS = 60
    currentFrameIndexPerSeconde = 0
    gameStatus = {
        loading: false
    }
    helloWorldPosition = {
        x: 0,
        directionRight: true,
        y: 0,
        directionBottom: true
    }

    /**
     * 每一帧执行的行为
     */
    run() {
        var c = document.getElementById('canvas');
        var ctx = c.getContext("2d");
        // 清理掉原来内容, 重新绘制最新的状态
        ctx.clearRect(0, 0, c.width, c.height)
        const that = this;

        // 打印FPS
        drawFPS(ctx, this.gameFPS)

        // draw helloworld
        drawHelloWorld(ctx, this.helloWorldPosition)

        // 执行下一帧
        this.currentFrameIndexPerSeconde++
        window.requestAnimationFrame(() => {
            this.run()
        })
    }

    getFPS() {
        this.gameFPS = this.currentFrameIndexPerSeconde
        this.currentFrameIndexPerSeconde = 0
        return this
    }

    start() {
        console.log("running")
        console.log(+ new Date())
        window.requestAnimationFrame(() => {
            this.run()
        })
    }

}




let __game = new Game()
__game.start()
window.__game = __game


loadInitResources(() => {
    console.log("window.resources", window.resources)
})
