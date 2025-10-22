'use client'
import React, { useEffect, useRef, useState } from 'react'

export default function FullPageClient({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling.current) return

      e.preventDefault()
      isScrolling.current = true

      const children = containerRef.current?.children
      if (!children) return

      const totalPages = children.length

      if (e.deltaY > 0 && currentPage < totalPages - 1) {
        // Scroll down
        setCurrentPage((prev) => prev + 1)
      } else if (e.deltaY < 0 && currentPage > 0) {
        // Scroll up
        setCurrentPage((prev) => prev - 1)
      } else {
        isScrolling.current = false
      }

      // isScrolling will be reset by the scroll effect
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return

      const children = containerRef.current?.children
      if (!children) return

      const totalPages = children.length

      if ((e.key === 'ArrowDown' || e.key === 'PageDown') && currentPage < totalPages - 1) {
        e.preventDefault()
        isScrolling.current = true
        setCurrentPage((prev) => prev + 1)
        // isScrolling will be reset by the scroll effect
      } else if ((e.key === 'ArrowUp' || e.key === 'PageUp') && currentPage > 0) {
        e.preventDefault()
        isScrolling.current = true
        setCurrentPage((prev) => prev - 1)
        // isScrolling will be reset by the scroll effect
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [currentPage])

  useEffect(() => {
    // Smooth scroll to the current page
    const scrollToPage = () => {
      const scrollTop = currentPage * window.innerHeight
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
      // Reset isScrolling flag after smooth scroll completes
      setTimeout(() => {
        isScrolling.current = false
      }, 300)
    }

    scrollToPage()
  }, [currentPage])

  // Remove scroll event listener to prevent conflicts with smooth scrolling

  return (
    <div className='relative'>
      <div ref={containerRef}>
        {React.Children.map(children, (child, index) => (
          <div key={index} className='h-screen w-full last:h-[calc(100vh-200px)]'>
            {child}
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className='fixed top-1/2 right-6 z-50 flex -translate-y-1/2 flex-col gap-3'>
        {React.Children.map(children, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              index === currentPage ? 'scale-125 bg-white' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to page ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
