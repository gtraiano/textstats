import React from 'react'

const TextStats = ({ show, data, style, title="Text statistics", header=['statistic', 'result'] }) => {
    if(!data || !show) {
        return null
    }

    return (
        <div>
            <h2>{title}</h2>
            <div style={{ ...style, overflow: 'auto' }}>
                <table className="results-table sticky-head">
                    <thead>
                        <tr>
                        {
                            header.map(h => <th key={h}>{h}</th>)
                        }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.entries(data).map(([key, value]) =>
                                <tr key={key}>
                                    <td>
                                        {key !== 'index of coincidence'
                                            ? key
                                            : <>
                                                {key}&nbsp;
                                                <a style={{textDecorationStyle: 'double', fontWeight: 'lighter'}} href="https://pages.mtu.edu/~shene/NSF-4/Tutorial/VIG/Vig-IOC.html" target="_blank" rel="noreferrer">
                                                    ?
                                                </a>
                                            </>
                                        }
                                    </td>
                                    <td>{value}</td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default TextStats