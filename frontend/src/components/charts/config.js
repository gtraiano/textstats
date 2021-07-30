const barChart = {
    type: "bar",
    data: {},
    options : {
        maintainAspectRatio: false,
        aspectRatio: 2,
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    autoSkip: false
                }
            },
            x: {
                ticks: {
                    autoSkip: false,
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    filter: () => null
                },
                title: {
                    display: true,
                    text: '',
                    font: {
                        weight: 'bold'
                    }
                },
            }
        }
    }
}

const doughnutChart = {
    type: 'doughnut',
    data: {},
    options: {
        aspectRatio: 1,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'right'
            },
            title: {
                display: true,
                text: '',
            }
        }
    }
}

const radarChart = {
    type: "radar",
    data: {},
    options: {
        aspectRatio: 1,
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                display: true
                //filter: () => null
            },
            title: {
                display: true,
                text: '',
            },
            filler: {
                propagate: false
            },
            'samples-filler-analyser': {
                target: 'chart-analyser'
            }
        },
        interaction: {
            intersect: false
        }
    }
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    barChart,
    doughnutChart,
    radarChart
}