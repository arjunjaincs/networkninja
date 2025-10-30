import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react'

export default function NewsArticleModal({ article, onClose }) {
  if (!article) return null

  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'support': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'outrage': return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <Minus className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border-2 border-cyan-500/50 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-900/20 to-blue-900/20">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2 text-xs text-cyan-400">
                  <span className="font-bold uppercase tracking-wider">Breaking News</span>
                  <span>•</span>
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{article.timestamp}</span>
                </div>
                <h1 className="text-2xl font-bold text-white leading-tight">
                  {article.headline}
                </h1>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Article Content */}
            <div className="prose prose-invert max-w-none mb-6">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {article.content}
              </p>
            </div>

            {/* Public Reaction */}
            {article.publicReaction && article.publicReaction.length > 0 && (
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <h3 className="text-lg font-bold text-blue-400 mb-3">
                  📊 Public Reaction
                </h3>
                <div className="space-y-2">
                  {article.publicReaction.map((reaction, index) => (
                    <div key={index} className="flex items-center gap-3">
                      {getSentimentIcon(reaction.sentiment)}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-300">{reaction.text}</span>
                          <span className="text-sm font-bold text-cyan-400">
                            {reaction.percentage}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${reaction.percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className={`h-full ${
                              reaction.sentiment === 'support' ? 'bg-green-500' :
                              reaction.sentiment === 'outrage' ? 'bg-red-500' :
                              reaction.sentiment === 'fear' ? 'bg-yellow-500' :
                              'bg-gray-500'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Consequences */}
            {article.consequences && article.consequences.length > 0 && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <h3 className="text-lg font-bold text-red-400 mb-3">
                  ⚠️ Consequences
                </h3>
                <ul className="space-y-2">
                  {article.consequences.map((consequence, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-sm text-gray-300 flex items-start gap-2"
                    >
                      <span className="text-red-400 flex-shrink-0">•</span>
                      <span>{consequence}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Stories */}
            {article.relatedStories && article.relatedStories.length > 0 && (
              <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
                <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">
                  Related Stories
                </h3>
                <ul className="space-y-1">
                  {article.relatedStories.map((story, index) => (
                    <li key={index} className="text-sm text-cyan-400 hover:text-cyan-300 cursor-pointer">
                      → {story}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-cyan-500/30 bg-gray-900/50 flex items-center justify-between">
            <div className="text-xs text-gray-500">
              This article was generated based on your actions in the game
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-bold transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
