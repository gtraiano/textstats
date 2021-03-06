import React, { useEffect, useState } from 'react'
import { BarChart, DoughnutChart, RadarChart } from './charts/'

const Charts = ({ charStats, graphColors, wordStats, isAnalysisReady }) => {
    const [charts, setCharts] = useState([])
    const [selectedIndex, setSelectedIndex] = useState(0)
    const chartStyle = { width: '75%', height: '75%' }
    
    useEffect(() => {
        if(isAnalysisReady && charStats && wordStats && graphColors) {
            setCharts([
                {
                    title: 'Letter absolute frequency',
                    chart: (
                        <BarChart
                            style={chartStyle}
                            dataset={
                              {
                                
                                labels: charStats.letterFreqs.map(([key,]) => key),
                                values: charStats.letterFreqs.map(([, { absolute }]) => absolute ),
                                backgroundColors: graphColors.chars.letter
                              }
                            }
                            options={{ chartTitle: 'Letter absolute frequency', chartId: 'letter_freqs_absolute' }}
                        />
                    )
                },
                {
                    title: 'Letter relative frequency',
                    chart: (
                        <DoughnutChart 
                            style={chartStyle}
                            dataset={
                              {
                                label: '% of occurences',
                                labels: charStats.letterFreqs.map(([key, ]) => key),
                                values: charStats.letterFreqs.map(([, { relative }]) => (relative*100).toFixed(2) ) || null,
                                backgroundColors: graphColors.chars.letter
                              }
                            }
                            options={{ chartTitle: 'Letter relative frequency %', chartId: 'letter_freqs_relevant' }}
                        />
                    )
                },
                {
                    title: 'Punctuation absolute frequency',
                    chart: (
                        <BarChart
                            style={chartStyle}
                            dataset={
                              {
                                labels: charStats?.punctuationCount.punct.map(([key, ]) => key) || [],
                                values: charStats?.punctuationCount.punct.map(([ ,val]) => val) || null,
                              }
                            }
                            options={{ chartTitle: 'Punctuation absolute frequency', chartId: 'letter_punctuation' }}
                        />
                  )
                },
                {
                    title: 'Word absolute frequency',
                    chart: (
                        <BarChart
                            style={
                                wordStats.wordFreqs.length <= 35
                                ? chartStyle
                                : {
                                    ...chartStyle,
                                    height: `${100*Object.keys(wordStats.wordFreqs).length/35}%`,
                                    position: 'absolute',
                                    top: '13%'
                                  }
                            }
                            dataset={
                              {
                                labels: wordStats?.wordFreqs.map(([w]) => w) || [],
                                values: wordStats?.wordFreqs.map(([,{ absolute }]) => absolute) || null,
                                backgroundColors: graphColors.words
                              }
                            }
                            options={{ chartTitle: 'Word absolute frequency', verticalXAxisLabels: true, indexAxis: 'y', chartId: 'word_freqs_absolute' }}
                        />
                    )
                },
                {
                    title: 'Word relative frequency',
                    chart: (
                        <DoughnutChart
                            style={chartStyle}
                            dataset={
                              {
                                label: '% of occurences',
                                labels: wordStats.wordFreqs.map(([key, ]) => key),
                                values: wordStats.wordFreqs.map(([ ,{ relative }]) => (relative*100).toFixed(2)),
                                backgroundColors: graphColors.words
                              }
                            }
                            options={{ chartTitle: 'Word relative frequency %', chartId: 'word_freqs_relative' }}
                        />
                    )
                },
                {
                    title: 'Word frequency absolute vs. relative',
                    chart: (
                        <RadarChart
                            //style={chartStyle}
                            style={
                                wordStats.wordFreqs.length <= 35
                                ? chartStyle
                                : {
                                    ...chartStyle,
                                    height: `${(100*Object.keys(wordStats.wordFreqs).length/35)/2.5}%`,
                                    position: 'absolute',
                                    top: '13%'
                                  }
                            }
                            dataset={
                              {
                                labels: wordStats?.wordFreqs.map(([key, ]) => key) || [],
                                datasets: [
                                  {
                                    label: 'relative %',
                                    data: wordStats?.wordFreqs.map(([ ,{ absolute, relative }]) => 100*Number.parseFloat(relative)) || null,
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                    borderColor: 'rgb(54, 162, 235)',
                                    fill: true
                                  },
                                  {
                                    label: 'absolute',
                                    data: wordStats ? wordStats.wordFreqs.map(([ ,{ absolute, relative }]) => Number.parseFloat(absolute)) : null,
                                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                    borderColor: 'rgb(255, 99, 132)',
                                    fill: true
                                  }
                                ],
                              }
                            }
                            options={{ chartId: 'radar_chart', chartTitle: 'Word frequency' }}
                        />
                    )
                }
            ])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charStats, graphColors, wordStats])

    if(!isAnalysisReady || !charts || !charts.length) {
        return null
    }

    return (
        <div>
            <div style={{ position: 'absolute', top: '0.25%', width: 'max-content', right: '2%', zIndex: 1 }}>
                <select
                    value={selectedIndex}
                    style={{ padding: '5px', fontSize: 'medium', backgroundColor: 'transparent', border: '1px solid black', borderRadius: '4px' }}
                    onChange={ e => setSelectedIndex(e.target.value)}
                >
                    {charts.map((chart,index) => <option key={index} value={index}>{chart.title}</option>)}
                </select>
            </div>
            <div
                style={{ height: '100vh', position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center' }}
            >
                {charts[selectedIndex].chart}
            </div>
        </div>
    )
}

export default Charts
