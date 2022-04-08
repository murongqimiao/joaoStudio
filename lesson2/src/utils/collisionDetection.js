import { getMainViewportPostion } from "./positionReset"
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
    const type = objectA.curRender.curFrameInfo.shape + '_' + objectB.curRender.curFrameInfo.shape
    switch (type) {
        case 'rectangle_rectangle':
            return rectanglesCollisionDetection(getBulkBorder(objectA), getBulkBorder(objectB));
        case 'rectangle_circle':
            return rectangleCircleCollisionDetection(getBulkBorder(objectA), getBulkBorder(objectB));
        case 'circle_rectangle':
            return rectangleCircleCollisionDetection(getBulkBorder(objectB), getBulkBorder(objectA))
        case 'circle_circle':
            return circlesCollisionDetection(getBulkBorder(objectA), getBulkBorder(objectB))
        default: () => false
    }
}

/**
 * 获取角色体积边界,用来debug描边
 * x1y1 --------- x4y4
 *   |             |
 *   |             |
 *   |             |
 * x2y2 -------- x3y3
 * @param {*} bulk 
 * @returns 
 */
export const getBulkBorder = (bulk, xywhs, centerOriginxy, imgSize) => {
    let x1,y1,x2,y2,x3,y3,x4,y4
    // const { x, y } = getMainViewportPostion(bulk.position)
    const { x, y } = bulk.position
    if (!xywhs) { xywhs = getXYWHSByString(bulk.curRender.curFrameInfo.volumeInfo) }
    if (!centerOriginxy) { centerOriginxy = getCenterOriginByString(bulk.curRender.curFrameInfo.centerOrigin) }
    if (!imgSize) { imgSize = getCenterOriginByString(bulk.curRender.curFrameInfo.imgSizeInfo) }
    let renderXInCanvas = Math.round(x - centerOriginxy.x)
    let renderYInCanvas = Math.round(y - centerOriginxy.y)
    x2 = x1 = renderXInCanvas + xywhs.x
    y4 = y1 = renderYInCanvas + xywhs.y
    y3 = y2 = y1 + xywhs.height
    x3 = x4 = x1 + xywhs.width
    if (bulk.state.volumeInfo.shape === 'circle') {
        // case circle return x1,y1 r
        return [(x1 / 2 + x3 / 2), (y1 / 2 + y3 / 2), xywhs.width / 2]
    } else if ((bulk.state.volumeInfo.shape === 'rectangle')) {
        // computed volume x1y1 x2y2 x3y3 x4y4 position
        return [x1,y1,x2,y2,x3,y3,x4,y4]
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
        if (computedDistance(Bx1, By1, Ax1, Ay1) <= r) {
            // console.log("========left top crash =========")
            result = true
        }
    } else if (Bx1 < Ax1 && By1 > Ay1 && By1 < Ay2) { // left center
        // console.log(' left center')
        if ((centerA.x - Bx1) <= (r + (widthA / 2))) {
            // console.log("==========left center crash=========")
            result = true
        }
    } else if (Bx1 < Ax1 && By1 > Ay2) { // left bottom
        // console.log('left bottom')
        if (computedDistance(Bx1, By1, Ax2, Ay2) <= r) {
            // console.log("=========left bottom crash =========")
            result = true
        }
    } else if (Bx1 > Ax1 && Bx1 < Ax3 && By1 > Ay2) { // center bottom
        // console.log('center bottom')
        if ((By1 - centerA.y) <= (r + (heightA) / 2)) {
            // console.log("==========center  bottom crash======")
            result = true
        }
    } else if (Bx1 > Ax3 && By1 > Ay3) { // bottom right
        // console.log(' bottom right', computedDistance(Bx1, By1, Ax3, Ay3) < r)
        if (computedDistance(Bx1, By1, Ax3, Ay3) <= r) {
            // console.log("===========bottom right crash===========")
            result = true
        }
    } else if (Bx1 > Ax4 && By1 > Ay4 && By1 < Ay3) { // right
        // console.log('right', ((Bx1 - centerA.x) < (r + (widthA) / 2)))
        if ((Bx1 - centerA.x) <= (r + (widthA) / 2)) {
            // console.log("==============right crash=========")
            result = true
        }
    } else if (Bx1 > Ax4 && By1 < Ay4) { // right top
        // console.log('right top')
        if (computedDistance(Bx1, By1, Ax4, Ay4) <= r) {
            // console.log("=======right top crash========")
            // console.log(Bx1, By1, Ax4, Ay4)
            result = true
        }
    } else if (Bx1 > Ax1 && Bx1 < Ax3 && By1 < Ay4) { // top
        // console.log('top')
        if ((centerA.y - By1) <= (r + (heightA / 2))) {
            // console.log("=========top crash===========")
            result = true
        }
    } else {
        // result = true // circle origin in center
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

export const computedDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2))
}

export const getDistancesWidth = (objectA, objectB) => {
    const positionA = objectA.position
    const positionB = objectB.position
    return computedDistance(positionA.x, positionA.y, positionB.x, positionB.y)
}

/**
 * get position x position y width height isSolid by string 1_2_3_4_0
 */
export const getXYWHSByString = (str) => {
    const [x = 0, y = 0, width = 0, height = 0, isSolid = false] = str.split("_")
    return {
        x: Number(x),
        y: Number(y),
        width: Number(width),
        height: Number(height),
        isSolid: Boolean(isSolid)
    }
}

/**
 * get position x position y width str
 */
export const getCenterOriginByString = (str) => {
    const [x = 0, y = 0] = str.split("_")
    return {
        x: Number(x),
        y: Number(y),
    }
}

/**
 * get img offset x offset y 
 * @returns 
 */
export const getOffsetXYByString = (str) => {
  const [x = 0, y = 0] = str.split("_")
  return {
      x: Number(x),
      y: Number(y),
  }
}

/**
 * 
 * get skill position width hero stand
 */
export const getSkillPositionWidthHero = (hero, skillObject) => {
    const { x, y } = hero.position
    const direction = hero.curEvent.slice(0, 1)  // hero`s face to direction
    const [relative_x, relative_y] = skillObject.state.positionWidthHero[direction].split("_")
    return {
        x: x + Number(relative_x),
        y: y + Number(relative_y)
    }
}

/**
 * computed postion x1y1 and x2y2
 * return direction of face to
 * 7        0        1
 *      _______
 *     |        |
 * 6   |  x1y1  |     2
 *     |        |
 *     |--------|
 *  5       4        3
 */
export const getFaceToDirection = ({ x1, y1, x2, y2, abs = 10 }) => {
    const x_abs = Math.abs(x1 - x2)
    const y_abs = Math.abs(y1 - y2)
    // y小于abs优先考虑 6 2
    // x小于abs优先考虑 0 4
    if (y_abs < abs) {
        if (x1 < x2) {
            return 2
        } else {
            return 6
        }
    } else if (x_abs < abs) {
        if (y1 < y2) {
            return 4
        } else {
            return 0
        }
    } else if (x1 < x2 && y1 < y2) {
        return 3
    } else if (x1 < x2 && y1 > y2) {
        return 1
    } else if (x1 > x2 && y1 < y2) {
        return 5
    }  else if (x1 > x2 && y1 > y2) {
        return 7
    }
}