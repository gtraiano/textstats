import React, { useEffect, useRef } from 'react'
import { prepareCanvas, textBoxDimensions, checkRectangleCollision, withinCanvas } from '../utils/canvas'

/*
    dataset             array of strings to be drawn in canvas
    containerStyle      canvas container css style object
    canvasLabel         label below canvas (optional)
    fontFamilies        fonts available for canvas text
    children            children to be included in container
*/

const StatsCanvas = React.forwardRef((
    { dataset, containerStyle, canvasLabel, canvasLabelStyle, fontFamilies, children },
    ref
) => {
    React.useImperativeHandle(ref, () => {
        return {
          drawCanvas // expose method for drawing
        }
    });
    
    const canvasRef = useRef()
    
    const drawCanvas = (terms = dataset, canvas = canvasRef.current) => {
        //places terms in random positions inside canvas
        if(!terms || !terms.length || !canvas) return
        
        prepareCanvas(canvas)
        let ctx = canvas.getContext('2d')
    
        // highest and lowest frequency of terms
        const max = Math.max(...terms.map(t => t.value))
        const min = Math.min(...terms.map(t => t.value))
        // min and max font size for terms
        const maxFontSize = Math.round((canvas.height/terms.length) + Math.max(...terms.map(t => t.term.length)))
        const minFontSize = 8
        
        const points = [] // coordinations of existing terms on canvas
    
        // iterate terms
        terms.forEach(({ term, value }, index) => {
          let fontSize = Math.round(maxFontSize*(value-min + minFontSize)/(max-min + minFontSize))
          ctx.font = `${fontSize}px ${fontFamilies[index % fontFamilies.length]}`
          let textMetrics = ctx.measureText(term)
    
          let { width, height } = textBoxDimensions(textMetrics)
          let x, y
          let collision = false
          let inCanvas = false
    
          while(!inCanvas || collision) { // find (x,y)for which textbox is inside canvas and does not collide with existing textboxes
              x = Math.round(Math.random()*canvas.width * width) % (canvas.width)
              y = Math.round(Math.random()*canvas.height * height) % (canvas.height)
              collision = checkRectangleCollision({ x, y, textMetrics }, points)
              inCanvas = withinCanvas(canvas, { x, y, textMetrics })
          }
          points.push({ x, y, textMetrics })

          ctx.fillText(term, x, y) // draw term at (x,y)
        })
    }

    useEffect(() => {
        if(dataset && canvasRef && canvasRef.current) {
            drawCanvas()
        }//eslint-disable-next-line
    }, [dataset])
    
    if(!dataset || !dataset.length)
        return null
    return (
      <div style={containerStyle}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}></canvas>
        {canvasLabel && <label style={canvasLabelStyle}>{canvasLabel}</label>}
        <br/>
        {children}
      </div>
    )
})

export default StatsCanvas