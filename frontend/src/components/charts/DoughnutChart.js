import React, { useEffect, useRef } from 'react'
import Chart from 'chart.js/auto'
import config from './config'

const DoughnutChart = ({ dataset, options, style, className }) => {
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
        return {
            ...config.doughnutChart.options,
            plugins: {
                ...config.doughnutChart.options.plugins,
                title: {
                    ...config.doughnutChart.options.plugins.title,
                    text: options.chartTitle || ''
                }
            }
        }
    }

    const isDatasetOk = (dataset) => {
        const values = dataset && dataset.values
        const colors = dataset && dataset.backgroundColors && dataset.values && dataset.backgroundColors.length === dataset.values.length
        return values || colors
    }

    useEffect(() => {
        if(canvasRef && canvasRef.current) {
            const chart = new Chart(canvasRef.current.getContext('2d'), {
                ...config.doughnutChart,
                data: updateDataset(dataset),
                options: updateOptions(options)
            })
            chartRef.current = chart
            return () => { chartRef.current.destroy() }
        }
    }, [dataset, options, canvasRef])

    if(!isDatasetOk(dataset)) {
        return null
    }

    return (
        <div style={style} className={className}>
          <canvas ref={canvasRef} id={dataset?.chartId} />
        </div>
    )
}

export default DoughnutChart