export const drawMap = function ({ ctx, mainViewportPosition }) {
    const { map, leftDistances, topDistances, height, width, scale } = mainViewportPosition
    let _map = window.resources[map]
    if (map && _map) {
        ctx.drawImage(_map, leftDistances / scale, topDistances / scale, width / scale, height / scale, 0, 0, width, height)
    }
}

/**
 * 这里考虑n个点构成的多边形, 采用射线法判断点在多边形内部还是外部. 统一使用 测试坐标点位起点, 3点钟方向的射线测量. 
 * @params{points} 构成多边形的n个点的位置, x,y
 * [points] = [[x1, y1], [x2, y2], [x3,y3], [x4,y4]]
 */
export const checkPointInMap = function(points = [], position = { x: 0, y: 0}, type = 'in') {
    let instersect = []
    const { x, y } = position
    points.forEach((v, index) => {
        let nextOne = points[index + 1] || points[0]
        instersect.push([v[0], v[1], nextOne[0], nextOne[1], x, y])
    })
    instersect = instersect.map(v => checkPointOnTheLineSegmentCreatByTwoPoints(v))
    if (type === 'in') {
        // 点在多边形内部则交点个数为奇数
        return instersect.filter(v => v).length % 2 === 1
    } else {
        // 点在多边形外部则焦点个数为偶数
        return instersect.filter(v => v).length % 2 === 0
    }
}

/**
 *  检测某点是否在x1,y1 x2,y2形成的线段上,
 *  其中x1,y1,为起始点,考虑此位置, x2,y2,为空心,不考虑此位置
 */
const checkPointOnTheLineSegmentCreatByTwoPoints = function([x1, y1, x2, y2, x, y]) {
    // step1 检测起点在上或者下
    const p1IsTop = (y1 === Math.max(y1, y2))
    if (p1IsTop && (y > y1 || y <= y2)) {
        return false
    } else if (!p1IsTop && (y < y1 || y >= y2)) {
        return false
    }
    let thePositionX = (((x2 - x1) * (y - y1)) / (y2 - y1)) + x1
    if (thePositionX >= x) {
        // 射线相交
        return true
    } else {
        return false
    }
}