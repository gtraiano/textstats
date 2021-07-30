import React from 'react'

const WordStats = ({ show, data, style, showIndex = true }) => {
    if(!data || !show) {
        return null
    }

    return (
        <div>
            <h2>Word statistics</h2>
            <div style={{ ...style, overflow: 'auto' }}>
                <table className="results-table sticky-head">
                    <thead>
                        <tr>
                            {showIndex && <th>#</th>}
                            <th>word</th>
                            <th>absolute</th>
                            <th>relative</th>
                            <th>relative incl. whitespace</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Object.entries(data.wordFreqs).map(([key, value], index) =>
                                <tr key={key}>
                                    {showIndex && <td>{index+1}</td>}
                                    <td>{key}</td>
                                    <td>{value.absolute}</td>
                                    <td>{value.relative}</td>
                                    <td>{value.relativeWithWhiteSpace}</td>
                                </tr>
                            )
                        }
                        <tr className="secondary-head">
                            <th colSpan={showIndex ? 5 : 4}>word length</th>
                        </tr>
                        <tr>
                            {showIndex && <td></td>}
                            <td>longest word length</td>
                            <td>{data.longestLength}</td>
                            <td colSpan="2"></td>
                        </tr>
                        <tr>
                            {showIndex && <td></td>}
                            <td>shortest word length</td>
                            <td>{data.shortestLength}</td>
                            <td colSpan="2"></td>
                        </tr>
                        <tr>
                            {showIndex && <td></td>}
                            <td>average word length</td>
                            <td>{data.averageLength}</td>
                            <td colSpan="2"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default WordStats