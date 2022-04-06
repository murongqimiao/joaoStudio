/**
 * check all imgs loaded in window
 * return percent of img loaded
 */
const getImgsLoadStatus = () => {
    let imgNumber = document.querySelectorAll('img').length
    const imgListLoadStatus = []

    while (imgNumber > 0) {
        imgListLoadStatus.push(document.querySelectorAll('img')[imgNumber - 1].complete)
        document.querySelectorAll('img')[imgNumber]
        imgNumber--
    }
    const imgLoadedNumber = imgListLoadStatus.filter(v => v).length
    return imgLoadedNumber * 100 / imgListLoadStatus.length
}

const renderLoadStatusInWindow = (percent) => {
    const el = document.querySelector('#load-status')
    const msg = percent === 100 ? `加载完成` : `...已加载${percent}%`
    el.innerHTML = msg
}

const removeLoadStatusInWindow = () => {
    const el = document.querySelector('#load-status')
    el.parentElement.removeChild(el)
}

export const startPollingImgStatus = (cb) => {

    let checkImgLoadStatus = setInterval(() => {
        let loadResult = getImgsLoadStatus()
        renderLoadStatusInWindow(loadResult)
        if (loadResult === 100) {
            // load success
            clearInterval(checkImgLoadStatus)
            cb && cb()
            setTimeout(() => {
                removeLoadStatusInWindow()
            }, 1500);
        }
    }, 300);

}