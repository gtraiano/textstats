export const prepareCanvas = (canvas) => {
    if(!canvas) return
    canvas.width = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height
    canvas.style.width = canvas.width + 'px'
    canvas.style.height = canvas.height + 'px'
}

export const textBoxDimensions = textMetrics => {
    return {
      width: textMetrics.actualBoundingBoxRight - textMetrics.actualBoundingBoxLeft,
      height: textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent
    }
    
}

// check if rectangle a overlaps rectangle b
export const rectanglesOverlappingArea = (a, b) => {
    //https://math.stackexchange.com/questions/99565/simplest-way-to-calculate-the-intersect-area-of-two-rectangles
    const rectA = {
        left: a.x + a.textMetrics.actualBoundingBoxLeft,
        right: a.x + a.textMetrics.actualBoundingBoxRight,
        top: a.y - a.textMetrics.actualBoundingBoxAscent,
        bottom: a.y + a.textMetrics.actualBoundingBoxDescent
    }

    const rectB = {
        left: b.x + b.textMetrics.actualBoundingBoxLeft,
        right: b.x + b.textMetrics.actualBoundingBoxRight,
        top: b.y - b.textMetrics.actualBoundingBoxAscent,
        bottom: b.y + b.textMetrics.actualBoundingBoxDescent
    }

    const x_overlap = Math.max(0, Math.min(rectA.right, rectB.right) - Math.max(rectA.left, rectB.left))
    const y_overlap = Math.max(0, Math.min(rectA.bottom, rectB.bottom) - Math.max(rectA.top, rectB.top))
    const overlapArea = x_overlap * y_overlap
    return overlapArea
}

export const withinCanvas = (canvas, point) => {
    let ctx = canvas.getContext('2d')
    ctx.rect(0, 0, canvas.width, canvas.height)

    return (
        ctx.isPointInPath(point.x + point.textMetrics.actualBoundingBoxLeft, point.y) &&
        ctx.isPointInPath(point.x + point.textMetrics.actualBoundingBoxRight, point.y) &&
        ctx.isPointInPath(point.x, point.y + point.textMetrics.actualBoundingBoxDescent) &&
        ctx.isPointInPath(point.x + point.textMetrics.actualBoundingBoxRight, point.y - point.textMetrics.actualBoundingBoxAscent)
    )
}

export const checkRectangleCollision = (a, points, ctx) => {      
    return points.some(p => {
        const cl = rectanglesOverlappingArea(a, p)
        return cl !== 0
    })
}