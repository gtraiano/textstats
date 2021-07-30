import React, { useEffect, useRef } from 'react'
import { prepareCanvas, textBoxDimensions, checkRectangleCollision, withinCanvas } from '../utils/canvas'

const StatsCanvas = React.forwardRef((
    { dataset, containerStyle, canvasLabel, canvasLabelStyle, fontFamilies, children },
    ref
) => {
    React.useImperativeHandle(ref, () => {
        return {
          // expose method for drawing
          drawCanvas: () => {
              drawCanvas()
          }
        }
    });
    
    const canvasRef = useRef()
    const drawCanvas = (terms = dataset, canvas = canvasRef.current) => {
        if(!terms || !terms.length || !canvas) return
        
        prepareCanvas(canvas)
        let ctx = canvas.getContext('2d')
    
        const max = Math.max(...terms.map(t => t.value))
        const min = Math.min(...terms.map(t => t.value))
        //const maxFontSize = 60
        const maxFontSize = Math.round((canvas.height/terms.length) + Math.max(...terms.map(t => t.term.length)))
        const minFontSize = 8
        const points = []
    
    
        terms.forEach(({ term, value }, index) => {
          let fontSize = Math.round(maxFontSize*(value-min + minFontSize)/(max-min + minFontSize))
          //ctx.font = `${fs}px Ubuntu sans-serif`
          ctx.font = `${fontSize}px ${fontFamilies[index % fontFamilies.length]}`
          //ctx.font = `${index < terms.length/2 ? 'bold' : ''} ${fontSize}px ${fontFamilies[index % fontFamilies.length]}`
          //let x = (value*Math.random() - 0 + fs*key.length)/(canvas.width)*canvas.width
          //let y = (value*Math.random() - 0 + fs)/(canvas.height)*canvas.height
          let textMetrics = ctx.measureText(term)
    
          let { width, height } = textBoxDimensions(textMetrics)
          let x, y
          //let x = Math.round(width + (Math.random()*canvas.width - 0)*(canvas.width-width/2 - width)/(canvas.width))
          //let y = Math.round(height + (Math.random()*canvas.height - 0)*(canvas.height-height - height)/(canvas.height))
          //let collision = checkCollision({ x, y, textMetrics }, points, ctx)
          //let inCanvas = withinCanvas(canvas, { x, y, textMetrics })
          let collision = false
          let inCanvas = false
    
          while(!inCanvas || collision) {
              x = Math.round(Math.random()*canvas.width * width) % (canvas.width)
              y = Math.round(Math.random()*canvas.height * height) % (canvas.height)
              collision = checkRectangleCollision({x, y, textMetrics}, points, ctx)
              inCanvas = withinCanvas(canvas, { x, y, textMetrics })
          }
          points.push({ x, y, textMetrics })

          ctx.fillText(term, x, y)
        })
    }

    useEffect(() => {
        //canvasRef.current && dataset && drawCanvas()
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