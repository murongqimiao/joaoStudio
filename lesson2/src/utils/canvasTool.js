/**
 * canvas 绘制功能抽离
 */

/**
 * draw dot
 * @param {*} ctx 
 * @param {*} x y  坐标 r 半径
 */
 export const drawDot = ({ ctx, color = 'red', width = 1 }, [x, y, r]) => {
    ctx.save()
    ctx.beginPath();
    ctx.arc(x, y, r * 2, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
}

/**
 * draw polygon
 * @params pointSet 偶数点集, x1,y1, x2,y2, x3,y3...
 */
export const drawPolygon = ({ ctx, color = 'red', width = 1 }, pointSet) => {
    if (pointSet && pointSet.length % 2 !== 1) {
        const origin = [pointSet[0], pointSet[1]]
        ctx.save()
        ctx.beginPath()
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.moveTo(pointSet.shift(), pointSet.shift());
        while (pointSet.length) {
            ctx.lineTo(pointSet.shift(), pointSet.shift());
        }
        ctx.lineTo(origin[0], origin[1])
        ctx.stroke();
        ctx.restore();
    } else {
        console.log("err pointSet is odd", pointSet)
    }
}

/**
 * scale the points arr
 * arr = [[1,2], [3,4], [5,6]]
 * scale 0.5
 * result = [0.5, 1, 1.5, 2, 2.5, 3]
 */
export const scalePoints = (arr, scale) => {
    return arr.map(v => v.map(k => k * scale))
}
    
/**
 * regress origin
 * @params [[2,4], [6,8]], left 1. top 2
 * retuslt = [[1,2], [5,6]]
 */
export const regressOrigin = function (points, left, top) {
   return points.map((item) => item.map((v, index) => index % 2 === 0 ? v - left : v - top))
}

/**
 * flat arr
 * @params arr = [[1,2], [3,4], [5,6]]
 * result [1,2,3,4,5,6]
 */
export const flatArr = function (arr) {
    return arr.join(",").split(",").map(i => Number(i))
}