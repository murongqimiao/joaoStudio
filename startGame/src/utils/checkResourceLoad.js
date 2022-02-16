/**
 * check imgs load status 
 */

const renderLoadStatusInWindow = (percent) => {
    const el = document.querySelector('#load-status')
    const msg = percent === 100 ? `加载完成` : `...已加载${percent}%`
    el.innerHTML = msg
}

const removeLoadStatusInWindow = () => {
    const el = document.querySelector('#load-status')
    el.parentElement.removeChild(el)
}

export const loadInitResources = (cb) => {
    /**
     * 向项目中添加本地图片资源
     */
    let files = require.context("../assets", true, /\.png/)
    let filesPaths = files.keys()
    loadImgs(filesPaths, cb)
}

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
            renderLoadStatusInWindow(currentLoadNumber/maxNumber)

            // load complete
            if (maxNumber === currentLoadNumber) {
                removeLoadStatusInWindow()
                game.gameStatus.loading = false
                completeFunc()
            }
        }
    })
}


