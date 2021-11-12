import { footMan } from "./data"

class Game {
    monsterList = []
    heroList = []
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

    addNewMonster(monster) {
        this.monsterList.push(monster)
        monster.onMonsterAdd && this.onMonsterAdd(monster)
    }

    addNewHero(hero) {
        console.log(hero)
        this.heroList.push(hero)
        hero.onHeroAdd && this.onHeroAdd(hero)
    }

    // 钩子
    onMonsterAdd(monster) { }
    onHeroAdd(hero) {
        hero.onHeroAdd(this, hero)
    }
    onMonsterMoveEnd(monster) { }
    onHeroMoveEnd(hero) { }
}

class Role {
    state = {}
    skill = {}
    position = {}
    onHeroAdd = null
    constructor(props) {
        this.state = props.role
        this.skill = props.skill
        this.onHeroAdd = props.onHeroAdd || null
        this.onMonsterAdd = props.onMonsterAdd || null
        this.position = props.position || { x: 100, y: 100, z: 0 }
    }
}

const footManNew = new Role(footMan)
const gameNew = new Game()

gameNew.addNewHero(footManNew)


gameNew.start()



