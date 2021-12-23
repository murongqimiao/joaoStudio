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
    
