'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

type FullPageContextValue = { currentPage: number }
const FullPageContext = createContext<FullPageContextValue | null>(null)

export function useFullPage() {
  const ctx = useContext(FullPageContext)
  return ctx
}

export default function FullPageClient({ children }: { children: React.ReactNode }) {
  const [currentPage, setCurrentPage] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sync currentPage with actual scroll position using Intersection Observer
  useEffect(() => {
    const pageElements = containerRef.current?.children
    if (!pageElements || pageElements.length === 0) return

    const observers: IntersectionObserver[] = []

    // Create an Intersection Observer for each page
    Array.from(pageElements).forEach((pageElement, index) => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // If this page is more than 50% visible, update currentPage
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              // Only update if not programmatically scrolling
              if (!isScrolling.current) {
                setCurrentPage((prev) => {
                  // Only update if different to avoid unnecessary re-renders
                  return index !== prev ? index : prev
                })
              }
            }
          })
        },
        {
          threshold: [0, 0.5, 1],
          rootMargin: '-20% 0px -20% 0px' // Require at least 50% visibility
        }
      )

      observer.observe(pageElement as Element)
      observers.push(observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, []) // Run once on mount

  // Handle manual scrollbar dragging - backup method for rapid scrolling
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null
    let ticking = false

    const handleScroll = () => {
      // Throttle scroll events
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Only handle if not programmatically scrolling
          if (!isScrolling.current) {
            const pageElements = containerRef.current?.children
            if (!pageElements) return

            const viewportHeight = window.innerHeight
            const scrollPosition = window.scrollY
            const newPage = Math.round(scrollPosition / viewportHeight)

            // Clamp to valid page range
            const totalPages = pageElements.length
            const clampedPage = Math.max(0, Math.min(newPage, totalPages - 1))

            setCurrentPage((prev) => {
              // Only update if different
              return clampedPage !== prev ? clampedPage : prev
            })
          }
          ticking = false
        })
        ticking = true
      }

      // Reset isScrolling flag after scroll ends (for programmatic scrolls)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
      scrollTimeout = setTimeout(() => {
        isScrolling.current = false
      }, 200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeout) {
        clearTimeout(scrollTimeout)
      }
    }
  }, [])

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
    // Smooth scroll to the current page (only when programmatically changing)
    if (isScrolling.current) {
      const scrollToPage = () => {
        const scrollTop = currentPage * window.innerHeight
        window.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        })
        // Reset isScrolling flag after smooth scroll completes
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
        scrollTimeoutRef.current = setTimeout(() => {
          isScrolling.current = false
        }, 500) // Increased timeout to account for smooth scroll duration
      }

      scrollToPage()
    }

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [currentPage])

  const handleDotClick = (index: number) => {
    if (isScrolling.current) return
    isScrolling.current = true
    setCurrentPage(index)
  }

  return (
    <FullPageContext.Provider value={{ currentPage }}>
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
              onClick={() => handleDotClick(index)}
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                index === currentPage ? 'scale-125 bg-white' : 'bg-gray-400 hover:bg-white/75'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </FullPageContext.Provider>
  )
}
