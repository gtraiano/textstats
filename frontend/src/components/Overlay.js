import '../styles/Overlay.css'
import React, { useEffect, useCallback, useRef } from 'react';

const Overlay = React.forwardRef(({ children }, ref) => {
    React.useImperativeHandle(ref, () => {
        return {
            // expose methods for showing/hiding overlay
            show: () => {
                openOverlay()
            },
            hide: () => {
                closeOverlay()
            }
        }
    })
  
    /*const style = {
        position: 'fixed',
        display: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 2,
        overflow: 'hidden'
    }*/
    const overlayRef = useRef()

    // overlay disappear
    const closeOverlay = useCallback(() => {
        try {
            overlayRef.current.style.display = 'none'
            document.documentElement.style.overflow = 'auto' // show browser scrollbars
            
        }
        catch(error) {
            console.log('error in closeOverlay()')
            console.error(error)
        }
    }, [overlayRef])

    // overlay appear
    const openOverlay = useCallback(() => {
        try {
            document.documentElement.style.overflow = 'hidden' // hide browser scrollbars
            overlayRef.current.style.display = 'block'
        }
        catch(error) {
            console.log('error in openOverlay()')
            console.error(error)
        }
    }, [overlayRef])

    useEffect(() => {
        const closeOnEscKey = e => {
            e.stopPropagation()
            if(e.key === 'Escape') {
                closeOverlay()
            }
        }

    if(overlayRef && overlayRef.current) {
        const tempRef = overlayRef.current
        overlayRef.current.focus()
        overlayRef.current.addEventListener('keyup', closeOnEscKey)

        // dismount cleanup
        return () => {
            tempRef.removeEventListener('keyup', closeOnEscKey)
        }    
    }
    
  }, [overlayRef, closeOverlay])
  
  return (
  	<div
      style={{backdropFilter: 'blur(10px)'}}
      className="overlay"
  	  ref={overlayRef}
      tabIndex="0"
  	>
  	  {children}
      {/* overlay close button */}
      <div style={{ position: 'absolute', width: '100%', top: '90%' }} className="link-button-container">
        <button
          type="button"
          onClick={event => { event.preventDefault(); closeOverlay(); }}
        >
          close
        </button>
      </div>
        
      {/* overlay close (X) button */}
      <button
        className="link-button"
        onClick={event => { event.preventDefault(); closeOverlay(); }}
        style={{ position: 'absolute', width: '2%', padding: 0, margin: 0, top: 0, left: '98%' }}
      >
        <a
          href="#close"
          style={{ fontWeight: 800, fontSize: '150%', color: 'black', textDecoration: 'none' }}
        >
          x
        </a>
      </button>
    </div>
  )
});

export default Overlay;