/**
 * collision detection
 * rectAngle
 * x1,y1┏━━━━┓ x4, y4
 *      ┃    ┃
 * x2,y2┗━━━━┛ x3, y3
 * 
 * circle
 * o(x1, y1)  ╭━╮
 * r          ╰━╯
 */

export const collisionDetection = (objectA, objectB) => {
    const type = objectA.state.volumeInfo.shape + '_' + objectB.state.volumeInfo.shape
    const checkShape = (item) => {
        if (item.state.volumeInfo.shape === 'circle') {
            const { x1, y1, x3, y3 } = item.curRender.lastFrame
            return [(x1 / 2 + x3 / 2), (y1 / 2 + y3 / 2), item.state.volumeInfo.r]
        } else if ((item.state.volumeInfo.shape === 'rectangle')) {
            const { x1, y1, x2, y2, x3, y3, x4, y4 } = item.curRender.lastFrame
            const { width, height } = item.state.volumeInfo
            const dx = (x3 - x1 - width) / 2
            const dy = (y3 - y1 - height) / 2
            return [x1 + dx, y1 + dy, x2 + dx, y2 - dy, x3 - dx, y3 - dy, x4 - dx, y4 + dy]
        }
    }
    switch (type) {
        case 'rectangle_rectangle':
            return rectanglesCollisionDetection(checkShape(objectA), checkShape(objectB));
        case 'rectangle_circle':
            return rectangleCircleCollisionDetection(checkShape(objectA), checkShape(objectB));
        case 'circle_rectangle':
            return rectangleCircleCollisionDetection(checkShape(objectB), checkShape(objectA))
        case 'circle_circle':
            return circlesCollisionDetection(checkShape(objectA), checkShape(objectB))
        default: () => false
    }
}

/**
 * 获取角色体积边界,用来debug描边
 * @param {*} bulk 
 * @returns 
 */
export const getBulkBorder = (bulk) => {
    if (bulk.state.volumeInfo.shape === 'circle') {
        const { x1, y1, x3, y3 } = bulk.curRender.lastFrame
        // case circle return x1,y1 r
        return [(x1 / 2 + x3 / 2), (y1 / 2 + y3 / 2), bulk.state.volumeInfo.r]
    } else if ((bulk.state.volumeInfo.shape === 'rectangle')) {
        const { x1, y1, x2, y2, x3, y3, x4, y4 } = bulk.curRender.lastFrame
        const { width, height } = bulk.state.volumeInfo
        const dx = (x3 - x1 - width) / 2
        const dy = (y3 - y1 - height) / 2
        // case rectangle return x1,y1, x2,y2 x3,y3, x4,y4
        return [x1 + dx, y1 + dy, x2 + dx, y2 - dy, x3 - dx, y3 - dy, x4 - dx, y4 + dy]
    }
}

const rectanglesCollisionDetection = ([Ax1, Ay1, Ax2, Ay2, Ax3, Ay3, Ax4, Ay4], [Bx1, By1, Bx2, By2, Bx3, By3, Bx4, By4]) => {
    let result = true
    let centerA = { x: 0, y: 0 }
    let centerB = { x: 0, y: 0 }
    const widthA = Math.abs(Ax1 - Ax3)
    const heightA = Math.abs(Ay1 - Ay3)
    const widthB = Math.abs(Bx1 - Bx3)
    const heightB = Math.abs(By1 - By3)
    centerA.x = (Ax2 + Ax4) / 2
    centerA.y = (Ay2 + Ay4) / 2
    centerB.x = (Bx2 + Bx4) / 2
    centerB.y = (By2 + By4) / 2
    if (Math.abs(centerA.x - centerB.x) > ((widthA + widthB) / 2)
        || Math.abs(centerA.y - centerB.y) > ((heightA + heightB) / 2)) {
        result = false
    }
    return result
}

const rectangleCircleCollisionDetection = ([Ax1, Ay1, Ax2, Ay2, Ax3, Ay3, Ax4, Ay4], [Bx1, By1, r]) => {
    // objectA -> rectangle objectB -> circle
    let centerA = { x: 0, y: 0 }
    centerA.x = (Ax1 + Ax4) / 2
    centerA.y = (Ay1 + Ay2) / 2
    const widthA = Math.abs(Ax1 - Ax3)
    const heightA = Math.abs(Ay1 - Ay3)
    let result = false
    // console.log([Ax1, Ay1, Ax2, Ay2, Ax3, Ay3, Ax4, Ay4], [Bx1, By1, r])

    if (Bx1 < Ax1 && By1 < Ay1) { // left top
        // console.log('left top')
        if (computedDistance(Bx1, By1, Ax1, Ay1) < r) {
            result = true
        }
    } else if (Bx1 < Ax1 && By1 > Ay1 && By1 < Ay2) { // left center
        // console.log(' left center')
        if ((centerA.x - Bx1) < (r + (widthA / 2))) {
            result = true
        }
    } else if (Bx1 < Ax1 && By1 > Ay2) { // left bottom
        // console.log('left bottom')
        if (computedDistance(Bx1, By1, Ax2, Ay2) < r) {
            result = true
        }
    } else if (Bx1 > Ax1 && Bx1 < Ax3 && By1 > Ay2) { // center bottom
        // console.log('center bottom')
        if ((By1 - centerA.y) < (r + (heightA) / 2)) {
            result = true
        }
    } else if (Bx1 > Ax3 && By1 > Ay3) { // bottom right
        // console.log(' bottom right', computedDistance(Bx1, By1, Ax3, Ay3) < r)
        if (computedDistance(Bx1, By1, Ax3, Ay3) < r) {
            result = true
        }
    } else if (Bx1 > Ax4 && By1 > Ay4 && By1 < Ay3) { // right
        // console.log('right', ((Bx1 - centerA.x) < (r + (widthA) / 2)))
        if ((Bx1 - centerA.x) < (r + (widthA) / 2)) {
            result = true
        }
    } else if (Bx1 > Ax4 && By1 < Ay4) { // right top
        // console.log('right top')
        if (computedDistance(Bx1, By1, Ax4, Ay4) < r) {
            result = true
        }
    } else if (Bx1 > Ax1 && Bx1 < Ax3 && By1 < Ay4) { // top
        // console.log('top')
        if ((centerA.y - By1) < (r + (heightA) / 2)) {
            result = true
        }
    } else {
        result = true // circle origin in center
    }
    return result
}

const circlesCollisionDetection = ([Ax1, Ax2, Ar1], [Bx1, Bx2, Ar2]) => {
    let result = true
    if (computedDistance(Ax1, Ax2, Bx1, Bx2) > (Ar1 + Ar2)) {
        result = false
    }
    return result
}

const computedDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2))
}