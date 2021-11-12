class game {
    constructor(props) {

    }

    run() {
        // 执行下一帧
        window.requestAnimationFrame(() => {
            // this.run()
        })
    }

    start() {
        console.log("running")
        console.log(+ new Date())
        window.requestAnimationFrame(() => {
            this.run()
        })
    }
}

const gameNew = new game()
gameNew.start()



