'use client'
import React from 'react'
import ReactFullpage from '@fullpage/react-fullpage'
// import '@fullpage/react-fullpage/dist/fullpage.css'
// import './styles.css'

export default function FullPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className='App'>
      <ReactFullpage
        debug
        credits={{ enabled: false }}
        render={() => <ReactFullpage.Wrapper>{children}</ReactFullpage.Wrapper>}
        licenseKey='ssss'
      />
    </div>
  )
}
