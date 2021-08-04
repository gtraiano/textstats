import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import config from './config'

const BarChart = ({ dataset, options, style, className }) => {
    const canvasRef = useRef()
    const chartRef = useRef()

    const updateDataset = (dataset) => {
        let backgroundColors = []
        if(!dataset.backgroundColors || !dataset.backgroundColors.length) {
            backgroundColors = dataset.values.map(() => `rgb(${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)}, ${Math.round(Math.random()*255)})`)
        }

        return {
            labels: dataset.labels,
            datasets: [
                {
                    label: dataset.label,
                    data: dataset.values,
                    backgroundColor: dataset.backgroundColors || backgroundColors,
                    borderColor: dataset.backgroundColors || backgroundColors,
                    borderWidth: 1
                }
            ]
        }
    }

    const updateOptions = (options) => {
        const newOptions = { ...config.barChart.options }
        newOptions.indexAxis = options.indexAxis || undefined
        newOptions.plugins.legend.title.text = options.chartTitle
        newOptions.scales.x.ticks = {
            ...newOptions.scales.x.ticks,
            ...options.verticalXAxisLabels && options.indexAxis && { indexAxis: options.indexAxis },
            ...options.verticalXAxisLabels && options.indexAxis !== 'y' && {
                ...{
                    autoSkip: false,
                    maxRotation: dataset.labels.some(l => l.length > 2) ? 90 : undefined,
                    minRotation: dataset.labels.some(l => l.length > 2) ? 90 : undefined,
                    labelOffset: dataset.labels.some(l => l.length > 2) ? -7 : undefined
                }
            }
        }
        return newOptions
    }

    const isDatasetOk = (dataset) => {
        const values = dataset && dataset.values
        const colors = dataset && dataset.backgroundColors && dataset.values && dataset.backgroundColors.length === dataset.values.length
        return values || colors
    }

    useEffect(() => {
        if(canvasRef && canvasRef.current) {
            chartRef.current = new Chart(canvasRef.current.getContext('2d'), {
                ...config.barChart,
                data: updateDataset(dataset),
                options : updateOptions(options)
            })
            return () => { chartRef.current.destroy() }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataset, options, canvasRef])

    

    if(!isDatasetOk(dataset)) {
        return null
    }
    
    return (
        <div style={style} className={className}>
            <canvas ref={canvasRef} id={options?.chartId}></canvas>
        </div>
    )
}

export default BarChart