import React, { useEffect, useState } from 'react'
import textAnalysis from './services/textAnalysis'
import StatsCanvas from './components/StatsCanvas'
import { addConfigParam } from './utils/config'
import Overlay from './components/Overlay'
import Charts from './components/Charts'


import './App.css'
import './styles/loader.css'
import Statistics from './components/Statistics'

function App() {
  const [text, setText] = useState('') // textarea
  // text analysis statistics
  const [charStats, setCharStats] = useState(null)
  const [wordStats, setWordStats] = useState(null)
  const [textStats, setTextStats] = useState(null)
  const [charNgramStats, setCharNgramStats] = useState(null)
  const [wordNgramStats, setWordNgramStats] = useState(null)
  
  const [graphColors, setGraphColors] = useState(null) // colors used for graphs ({ chars: { letter: [], punctuation: [] }, words: [] })
  const [isAnalysisReady, setIsAnalysisReady] = useState(undefined)
  const [canvasDataset, setCanvasDataset] = useState({
    n: 10,
    label: '',
    data: []
  })

  const canvasRef = React.createRef()
  const chartsOverlayRef = React.createRef()
  const progressOverlayRef = React.createRef()

  const [appInitialized, setAppInitialized] = useState(false)
  
  useEffect(() => {
    textAnalysis.welcome().then(data => console.log(data))
    textAnalysis.getRoutes().then(data => {
      addConfigParam('routes', data)
      setAppInitialized(true)
    })
  }, [])

  useEffect(() => {
    // display overlay while application is being initialized
    setText(localStorage.getItem('textarea-text') || '')
    progressOverlayRef.current[appInitialized ? 'hide' : 'show']()
  }, [appInitialized])

  useEffect(() => {
    console.log('character stats', charStats)
    console.log('word stats', wordStats)
    console.log('text stats', textStats)
    console.log('word ngram stats', wordNgramStats)
    console.log('char ngram stats', charNgramStats)
    if(isAnalysisReady) {
      setGraphColors({
        chars: {
          letter: charStats.letterFreqs.map(() => `rgb(${Math.ceil(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.ceil(Math.random()*255)})`),
          //punctuation: Object.keys(wordStats.wordFreqs).map(() => `rgb(${Math.ceil(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.ceil(Math.random()*255)})`)
          punctuation: Object.keys(charStats.punctuationCount).map(() => `rgb(${Math.ceil(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.ceil(Math.random()*255)})`)
        },
        words: wordStats.wordFreqs.map(() => `rgb(${Math.ceil(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.ceil(Math.random()*255)})`)
      })
      setCanvasDataset(
        { ...canvasDataset,
          label: `${canvasDataset.n} most frequent terms in text`,
          data: wordStats.wordFreqs
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
        'unique words %': ((wfResponse.wordFreqs.length / tsResponse.words)*100).toFixed(2)+'%',
        'length of shortest word': wfResponse.shortestLength,
        'length of longest word': wfResponse.longestLength,
        'average word length': wfResponse.averageLength.toFixed(2),
        'index of coincidence': //https://pages.mtu.edu/~shene/NSF-4/Tutorial/VIG/Vig-IOC.html
          (1 / ((lfResponse.charCount.total - lfResponse.charCount.whitespace) * (lfResponse.charCount.total - lfResponse.charCount.whitespace - 1 )))
          * lfResponse.letterFreqs.map(([, l]) => l.absolute * (l.absolute-1)).reduce((acc, cur) => acc + cur, 0)
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
  
  return (
    <div className="App">
      {/* text analysis/app initialization progress overlay */}
      <Overlay
        ref={progressOverlayRef}
        style={{ backgroundColor: 'white', opacity: 0.9 }}
        disableX
        disableClose
      >
        <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
          <h1 style={{ marginTop: '40vh' }}>{appInitialized ? 'Analyzing text' : 'Initializing application'}</h1>
          <div className="loader"></div>
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
        <Statistics
          isAnalysisReady={isAnalysisReady}
          charStats={charStats}
          wordStats={wordStats}
          charNgramStats={charNgramStats}
          wordNgramStats={wordNgramStats}
          textStats={textStats}
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
