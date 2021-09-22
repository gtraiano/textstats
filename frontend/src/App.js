import React, { useEffect, useState } from 'react'
import textAnalysis from './services/textAnalysis'
import LetterFrequencyTable from './components/LetterFrequencyTable'
import CharacterStats from './components/CharacterStats'
import TextStats from './components/TextStats'
import WordStats from './components/WordStats'
import StatsCanvas from './components/StatsCanvas'
import { addConfigParam } from './utils/config'
import Overlay from './components/Overlay'
import Charts from './components/Charts'


import './App.css'
import './styles/loader.css'

function App() {
  const [text, setText] = useState('') // textarea
  // text analysis statistics
  const [charStats, setCharStats] = useState(null)
  const [wordStats, setWordStats] = useState(null)
  const [textStats, setTextStats] = useState(null)
  const [charNgramStats, setCharNgramStats] = useState(null)
  const [wordNgramStats, setWordNgramStats] = useState(null)
  
  const [graphColors, setGraphColors] = useState(null) // colors used for graphs ({ chars: { letter: [], punctuation: [] }, words: [] })
  const [showStat, setShowStat] = useState({ letters: true, text: false, characters: false, word: false, ngram: false }) // display stats tables
  const [isAnalysisReady, setIsAnalysisReady] = useState(undefined)
  const [canvasDataset, setCanvasDataset] = useState({
    n: 10,
    label: '',
    data: []
  })

  const canvasRef = React.createRef()
  const chartsOverlayRef = React.createRef()
  const progressOverlayRef = React.createRef()
  
  useEffect(() => {
    textAnalysis.welcome().then(data => console.log(data))
    textAnalysis.getRoutes().then(data => {
      addConfigParam('routes', data)
    })
    setText(localStorage.getItem('textarea-text') || '')
  }, [])

  useEffect(() => {
    console.log('character stats', charStats)
    console.log('word stats', wordStats)
    console.log('text stats', textStats)
    console.log('char ngram stats', charNgramStats)
    if(isAnalysisReady) {
      setGraphColors({
        chars: {
          letter: Object.keys(charStats.letterFreqs).map(() => `rgb(${Math.ceil(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.ceil(Math.random()*255)})`),
          punctuation: Object.keys(wordStats.wordFreqs).map(l => `rgb(${Math.ceil(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.ceil(Math.random()*255)})`)
        },
        words: Object.keys(wordStats.wordFreqs).map(() => `rgb(${Math.ceil(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.ceil(Math.random()*255)})`)
      })
      setCanvasDataset(
        { ...canvasDataset,
          label: `${canvasDataset.n} most frequent terms in text`,
          data: Object.entries(wordStats.wordFreqs)
            .slice(0, canvasDataset.n)
            .map(w => ({ term: w[0], value: w[1].absolute }))
        }
      )
      setTimeout(() => canvasRef.current && canvasRef.current.drawCanvas(), 250)
    }//eslint-disable-next-line
  }, [isAnalysisReady])

  useEffect(() => {
    if(isAnalysisReady) {
      progressOverlayRef.current.hide()
    }
    else if(isAnalysisReady === false) {
        progressOverlayRef.current.show()
    }
    else if(isAnalysisReady === undefined && charStats !== null) { // first call to text analysis
      progressOverlayRef.current.show()
    }
  }, [charStats, isAnalysisReady, progressOverlayRef])

  useEffect(() => {
    localStorage.setItem('textarea-text', text)
  }, [text])

  const analyze = async () => {
    try {
      setIsAnalysisReady(false)
      
      const text = document.getElementById('textarea').value
      
      const lfResponse = await textAnalysis.letterFrequenciesAnalysis(text)
      const wfResponse = await textAnalysis.wordFrequenciesAnalysis(text)
      const tsResponse = await textAnalysis.textStats(text)
      const cngResponse = await textAnalysis.charNgramFrequencies(text)
      const wngResponse = await textAnalysis.wordNgramFrequencies(text)
      
      setCharStats(lfResponse)
      setWordStats(wfResponse)
      setTextStats({
        ...tsResponse,
        'unique words': Object.keys(wfResponse.wordFreqs).length,
        'unique words %': ((Object.keys(wfResponse.wordFreqs).length / tsResponse.words)*100).toFixed(2)+'%',
        'length of shortest word': wfResponse.shortestLength,
        'length of longest word': wfResponse.longestLength,
        'average word length': wfResponse.averageLength.toFixed(2),
        'index of coincidence': //https://pages.mtu.edu/~shene/NSF-4/Tutorial/VIG/Vig-IOC.html
          (1 / ((lfResponse.charCount.total - lfResponse.charCount.whitespace) * (lfResponse.charCount.total - lfResponse.charCount.whitespace - 1 )))
          * Object.values(lfResponse.letterFreqs).map(l => l.absolute * (l.absolute-1)).reduce((acc, cur) => acc + cur, 0)
      })
      setCharNgramStats(cngResponse)
      setWordNgramStats(wngResponse)

      setIsAnalysisReady(true)
    }
    catch(error) {
      setIsAnalysisReady(false)
      
      setCharStats(null)
      setWordStats(null)
      setTextStats(null)
      setCharNgramStats(null)
      setWordNgramStats(null)
      setCanvasDataset(null)
      
      console.error(error)
    }
  }

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
    <div className="App">
      {/* text analysis progress overlay */}
      <Overlay
        ref={progressOverlayRef}
        style={{ backgroundColor: 'white', opacity: 0.9 }}
        disableX
        disableClose
      >
        <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
          <h1 style={{ marginTop: '40vh' }}>Analyzing text</h1>
          <div class="loader"></div>
        </div>
        
      </Overlay>
      
      <h1 style={{marginBottom: 0, padding: 0}}>Text Statistics</h1>
      <StatsCanvas
        ref={canvasRef}
        dataset={canvasDataset?.data}
        canvasRef={canvasRef.current}
        canvasLabel={canvasDataset?.label}
        canvasLabelStyle={{ fontStyle: 'italic', fontSize: '75%' }}
        containerStyle={{ /*display: wordStats ? 'block' : 'none',*/ width: '50%', height: '25vh', marginLeft: 'auto', marginRight: 'auto', marginBottom: '2%' }}
        fontFamilies={['Ubuntu sans-serif'/*, 'Segoe UI', 'Roboto', 'Courier New'*/]}
      >
        <button
          onClick={() => canvasRef.current.drawCanvas()}
          style={{ marginTop: '1%' }}
        >
          draw
        </button>
      </StatsCanvas>
      <div className="textarea-container">
          <textarea id="textarea" placeholder="Enter text for analysis" rows="5" value={text} onChange={e => setText(e.target.value)}/>
          <br/>
          <button type="submit" onClick={async () => await analyze()}>analyze text</button>  
      </div>
      
      <div className="results">
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
          data={wordNgramStats?.map(n => n.ngrams).reduce((acc, cur) => ({ ...acc, ...cur }), {})}
          header={['n-gram', 'frequency']}
          title="Word n-gram occurences"
          style={{ height: '30vh', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
        />
        <TextStats
          show={showStat.text}
          data={textStats}
          style={{ height: '30vh', width: '50%', marginLeft: 'auto', marginRight: 'auto' }}
        />
        
        {isAnalysisReady &&
          <button
            style={{ marginTop: '1%', marginBottom: '1%' }}
            onClick={() => {chartsOverlayRef.current.show();}}
          >
            show graphs
          </button>
        }
        {/* charts overlay */}
        <Overlay ref={chartsOverlayRef}>
          <div style={{ height: 'inherit', overflow: 'auto', scrollbarWidth: 'thin', backgroundColor: 'rgba(255,255,255,0.9)' }}>
            <Charts
              isAnalysisReady={isAnalysisReady}
              charStats={charStats}
              graphColors={graphColors}
              wordStats={wordStats}
            />
          </div>
        </Overlay>
      </div>
      
    </div>
  );
}

export default App
