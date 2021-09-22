import React from 'react'

const CharacterStats = ({ show, data, style }) => {
    if(!data || !show) {
        return null
    }

    return (
        <div>
            <h2>Character statistics</h2>
            <div style={{ ...style, overflow: 'auto' }}>
                <table className="results-table sticky-head">
                    <thead>
                        <tr>
                            <th colSpan="3">Character occurences</th>
                        </tr>
                        <tr className="secondary-head">
                            <th>Category</th>
                            <th>Sub-category</th>
                            <th>count</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>alphabetic</td>
                            <td colSpan="2"></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>upper case</td>
                            <td>{data.alphabetic.upperCase}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>lower case</td>
                            <td>{data.alphabetic.lowerCase}</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td>total</td>
                            <td>{data.alphabetic.total}</td>
                        </tr>
                        <tr>
                            <td>digits</td>
                            <td></td>
                            <td>{data.digits}</td>
                        </tr>
                        <tr>
                            <td>punctuation</td>
                            <td colSpan="2"></td>
                        </tr>
                        {
                            Object.entries(data.punctuationCount).map(([key, value]) => {
                                return (
                                    value instanceof Array
                                        ? value.map(([k, v]) =>
                                            <tr key={k}>
                                                <td></td>
                                                <td>{k}</td>
                                                <td>{v}</td>
                                            </tr>
                                        )
                                        : <tr key={key}>
                                            <td></td>
                                            <td>{key}</td>
                                            <td>{value}</td>
                                        </tr>
                                )
                            })
                        }
                        <tr>
                            <td>whitespace</td>
                            <td></td>
                            <td>{data.whitespace}</td>
                        </tr>
                        <tr>
                            <td>word count</td>
                            <td></td>
                            <td>{data.wordCount}</td>
                        </tr>
                    </tbody>
                </table>
                {/*
                    Object.entries(data).map(([key, value]) => {
                        return (
                            value instanceof Object
                            ? <span key={key}>{key}<br/>{Object.entries(value).map(([key, value]) => <span key={key}>{key}: {value}<br/></span>)}</span>
                            : <span key={key}>{key}: {value}<br/></span>
                        )
                    })
                */}
            </div>
        </div>
    )
}

export default CharacterStats