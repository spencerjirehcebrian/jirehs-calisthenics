import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface MetadataTabsProps {
  tabs: Tab[]
  defaultTab?: string
  className?: string
}

export function MetadataTabs({
  tabs,
  defaultTab,
  className = ''
}: MetadataTabsProps) {
  // Filter out tabs with no content
  const validTabs = tabs.filter(tab => tab.content !== null && tab.content !== undefined)

  const [activeTabId, setActiveTabId] = useState(
    defaultTab || validTabs[0]?.id || ''
  )

  if (validTabs.length === 0) {
    return null
  }

  const activeTab = validTabs.find(tab => tab.id === activeTabId) || validTabs[0]

  return (
    <div className={`px-4 pb-2 ${className}`}>
      {/* Tab buttons */}
      <div className="flex gap-2 mb-3" role="tablist" aria-label="Information tabs">
        {validTabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => setActiveTabId(tab.id)}
            className={`
              px-4 py-2 rounded-full text-body-sm font-medium transition-all
              focus-interactive
              ${activeTabId === tab.id
                ? 'bg-earth-600 text-white dark:bg-earth-500'
                : 'bg-cream-200 text-ink-700 dark:bg-ink-800 dark:text-cream-300 hover:bg-cream-300 dark:hover:bg-ink-700'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab.id}
          id={`tabpanel-${activeTab.id}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeTab.id}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl bg-cream-50 dark:bg-ink-800 border border-cream-300/60 dark:border-ink-700"
        >
          {activeTab.content}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
