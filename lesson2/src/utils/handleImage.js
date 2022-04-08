/**
 * 生成帧动画列表
 */
export const generateFrameList = function (imageFrameInfoArr) {
    imageFrameInfoArr = imageFrameInfoArr.map((v, index) => {
        const [name = '', _offsetLeft = 0, _offsetTop = 0, toWidth = 0, toHeight = 0, centerLeft = 0, centerTop = 0, transoform = '', frames = '1', volumeOffsetLeft = 0, volumeOffsetTop = 0, volumeWidth = 0, volumeHeight = 0 ] = v.split(' | ')
        // name | _offsetLeft | _offsetTop | toWidth| toHeight | centerLeft | centerTop | volumeShape | transoform  共13项 | frames 每张图持续几帧
        return {
            name,
            frameStayTime: frames,
            centerOrigin: {
                left: centerLeft,
                top: centerTop
            },
            _offsetLeft,
            _offsetTop,
            renderStyle: {
                width: toWidth,
                height: toHeight,
                transoform: transoform,
            },
            volumeInfo: {
                offsetLeft: volumeOffsetLeft,
                offsetTop: volumeOffsetTop,
                width: volumeWidth,
                height: volumeHeight
            }
        }
    })
    return imageFrameInfoArr
}