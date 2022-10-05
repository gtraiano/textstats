import React, { useState } from "react";
import LetterFrequencyTable from './StatsTables/LetterFrequencyTable';
import CharacterStats from "./StatsTables/CharacterStats";
import WordStats from './StatsTables/WordStats';
import TextStats from './StatsTables/TextStats'

const Statistics = ({ isAnalysisReady, charStats, wordStats, charNgramStats, wordNgramStats, textStats }) => {

    const [showStat, setShowStat] = useState({ letters: true, text: false, characters: false, word: false, ngram: false }) // display stats tables

    const displayStatTable = (e, name) => {
        if(name === 'all') {
            setShowStat(Object.fromEntries(Object.keys(showStat).map((key) => [key, true])))
        }
        else {
            if(!e.ctrlKey) {
                setShowStat(Object.fromEntries(Object.entries(showStat).map(([key, value]) => [key, key === name ? true : false])))
            }
            else { // ctrl+click
                setShowStat({
                ...showStat,
                [name]: !showStat[name]
                })
            }
        }
    }
    
    return (
        <>
            <div
            style={{
                display: isAnalysisReady ? 'inline-block' : 'none',
                width: '100%'
            }}
            >
            <div
                style={{
                position: 'relative',
                width: 'max-content',
                left: '25%'
                }}
                title="crtl+click to select multiple categories"
            >
                <button type="navigation" className={showStat.letters ? 'active' : null} onClick={(e) => displayStatTable(e, 'letters')}>letters</button>
                <button type="navigation" className={showStat.characters ? 'active' : null} onClick={(e) => displayStatTable(e, 'characters')}>characters</button>
                <button type="navigation" className={showStat.word ? 'active' : null} onClick={(e) => displayStatTable(e, 'word')}>words</button>
                <button type="navigation" className={showStat.ngram ? 'active' : null} onClick={(e) => displayStatTable(e, 'ngram')}>n-grams</button>
                <button type="navigation" className={showStat.text ? 'active' : null} onClick={(e) => displayStatTable(e, 'text')}>text</button>
                <button type="navigation" className={Object.values(showStat).reduce((acc, cur) => acc && cur, true) ? 'active-all' : null} onClick={(e) => displayStatTable(e, 'all')}>all</button>
            </div>
            </div>

            <LetterFrequencyTable
                show={showStat.letters}
                results={charStats?.letterFreqs}
                style={{ height: '30vh', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <CharacterStats
                show={showStat.characters}
                data={
                    charStats
                    ? { ...charStats?.charCount, wordCount: charStats?.wordCount, punctuationCount: charStats?.punctuationCount }
                    : null
                }
                style={{ height: '30vh', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <WordStats
                show={showStat.word}
                data={wordStats}
                style={{ height: '30vh', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <TextStats
                show={showStat.ngram}
                data={charNgramStats?.ngrams}
                header={['n-gram', 'frequency']}
                title="Character n-gram occurences"
                style={{ height: '30vh', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <TextStats
                show={showStat.ngram}
                data={wordNgramStats?.flatMap(ng => [...ng.ngrams]).map(ng => ng)}
                header={['n-gram', 'frequency']}
                title="Word n-gram occurences"
                style={{ height: '30vh', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
            />
            <TextStats
                show={showStat.text}
                data={textStats}
                style={{ height: '30vh', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
            />
        </>
    )
}

export default Statistics