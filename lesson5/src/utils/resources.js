export const loadInitResources = (cb, filter) => {
    let files = require.context("../assets", true, /\.png/)
    let filesPaths = files.keys()
    if (filter) {
        filesPaths = filter(filter)
    }
    loadImgs(filesPaths, cb)
}



/**
 * 向项目中添加本地图片资源
 */
const loadImgs = (imgList, completeFunc) => {
    const game = window.__game
    const currentLoadImgs = {}
    let maxNumber = null
    let currentLoadNumber = 0

    game.gameStatus.loading = true // start loading modal

    // start load img
    imgList.forEach(v => {
        let _img = new Image()
        _img.src = "./assets/" + v
        currentLoadImgs[_img.src] = 0
        _img.onload = () => {
            currentLoadImgs[_img.src] = 1
            maxNumber = Object.keys(currentLoadImgs).length
            currentLoadNumber = Object.keys(currentLoadImgs).map(v => currentLoadImgs[v]).filter(v => v).length

            window.resources = Object.assign({}, (window.resources || {}), { [`${v.replaceAll('png', '').replaceAll('.', '').replaceAll('/', '_')}`]: _img })
            
            // update loading status
            game.gameStatus.waitForLoad = maxNumber // total imgs
            game.gameStatus.loadImgs = currentLoadNumber // has load imgs

            // load complete
            if (maxNumber === currentLoadNumber) {
                game.gameStatus.loading = false
                completeFunc()
            }
        }
    })
}