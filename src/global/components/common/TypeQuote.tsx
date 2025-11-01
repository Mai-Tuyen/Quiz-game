'use client'
import React from 'react'
import { ReactTyped } from 'react-typed'

export default function TypeQuote({ quotes }: { quotes: string[] }) {
  return <ReactTyped strings={quotes} typeSpeed={50} backSpeed={30} showCursor cursorChar='|' />
}
