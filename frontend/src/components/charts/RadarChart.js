import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import config from './config'

const RadarChart = ({ dataset, options, style, className }) => {
    const canvasRef = useRef()
    const chartRef = useRef()

    const updateDataset = (dataset) => {
        return dataset
    }

    const updateOptions = (options) => {
        const newOptions = { ...config.radarChart.options }
        newOptions.plugins.title.text = options?.chartTitle || ''
        return newOptions
    }
    
    useEffect(() => {
        if(canvasRef && canvasRef.current) {
            chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
                type: "radar",
                data: updateDataset(dataset),
                options: updateOptions(options)
            });
            return () => { chartRef.current.destroy() }
        }
      }, [dataset, options, canvasRef])

    if(!dataset){
        return null
    }

    return (
        <div style={style} className={className}>
          <canvas ref={canvasRef} id={options?.chartId} />
        </div>
    );
}

export default RadarChart