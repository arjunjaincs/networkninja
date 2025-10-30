import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Newspaper, TrendingUp, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'

export default function DynamicNewsTicker({ headlines = [], onHeadlineClick }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (headlines.length === 0 || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % headlines.length)
    }, 5000) // Change headline every 5 seconds

    return () => clearInterval(interval)
  }, [headlines.length, isPaused])

  if (headlines.length === 0) {
    return null
  }

  const currentHeadline = headlines[currentIndex]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-400 border-red-500/50 bg-red-900/20'
      case 'high': return 'text-orange-400 border-orange-500/50 bg-orange-900/20'
      case 'medium': return 'text-yellow-400 border-yellow-500/50 bg-yellow-900/20'
      default: return 'text-blue-400 border-blue-500/50 bg-blue-900/20'
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-4 h-4 animate-pulse" />
      case 'high': return <TrendingUp className="w-4 h-4" />
      default: return <Newspaper className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: isCollapsed ? -300 : 0 }}
      animate={{ opacity: 1, x: isCollapsed ? -280 : 0 }}
      className="fixed top-16 left-4 z-30 max-w-4xl"
    >
      {isCollapsed ? (
        /* Collapsed State - Small Arrow */
        <button
          onClick={() => setIsCollapsed(false)}
          className="p-2 bg-cyan-600/90 border-2 border-cyan-400 rounded-r-lg backdrop-blur-sm hover:bg-cyan-500 transition-all shadow-lg"
          title="Show breaking news"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      ) : (
        /* Expanded State - Full News */
        <div
          className={`border-2 rounded-lg p-3 backdrop-blur-sm transition-all relative ${getSeverityColor(currentHeadline.severity)}`}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Collapse Button */}
          <button
            onClick={() => setIsCollapsed(true)}
            className="absolute -right-2 top-1/2 transform -translate-y-1/2 p-1 bg-gray-800 border border-cyan-500/50 rounded-full hover:bg-gray-700 transition-colors"
            title="Hide news"
          >
            <ChevronLeft className="w-4 h-4 text-cyan-400" />
          </button>

          <div 
            className="cursor-pointer"
            onClick={() => onHeadlineClick && onHeadlineClick(currentHeadline)}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getSeverityIcon(currentHeadline.severity)}
              </div>
              
              <div className="flex-1 min-w-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentHeadline.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider opacity-70">
                        BREAKING NEWS
                      </span>
                      <span className="text-xs opacity-50">•</span>
                      <span className="text-xs opacity-70">
                        {new Date(currentHeadline.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm font-bold leading-tight">
                      {currentHeadline.headline}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pagination dots */}
              {headlines.length > 1 && (
                <div className="flex items-center gap-1 flex-shrink-0">
                  {headlines.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentIndex(index)
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-current w-4'
                          : 'bg-current opacity-30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Hover hint */}
            <div className="mt-2 text-xs opacity-50">
              Click to read full article • {headlines.length} breaking stories
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
