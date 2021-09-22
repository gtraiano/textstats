import React from 'react'
import '../styles/ResultsTable.css'

const LetterFrequencyTable = ({ show, results, style, showIndex = false }) => {
    if(!results || !show) {
        return null
    }

    return (
        <div>
            <h2>Letter occurences</h2>
            <div
                style={{ ...style, overflowX: 'auto' }}
            >
                <table className="results-table sticky-head">
                    <thead>
                        <tr>
                            {showIndex && <th>#</th>}
                            <th>Letter</th>
                            <th>absolute</th>
                            <th>relative</th>
                            <th>relative incl. whitespace</th>
                            <th>percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(([key, { absolute, relative, relativeWithWhiteSpace }], index) =>
                            <tr key={key}>
                                {showIndex && <td>{index+1}</td>}
                                <td>{key}</td>
                                <td>{absolute}</td>
                                <td>{relative}</td>
                                <td>{relativeWithWhiteSpace}</td>
                                <td>{(relative*100).toFixed(2)}%</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LetterFrequencyTable