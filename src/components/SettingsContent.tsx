import { EditorSettings } from './settings/sections/EditorSettings'
import { AppearanceSettings } from './settings/sections/AppearanceSettings'
import { motion, AnimatePresence } from 'framer-motion'

function PlaceholderContent({ title }: { title: string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-gray-400">Coming soon...</p>
    </div>
  )
}

const contentMap = {
  editor: EditorSettings,
  appearance: AppearanceSettings,
  pdf: () => <PlaceholderContent title="PDF Viewer Settings" />,
  files: () => <PlaceholderContent title="File Settings" />,
}

type Tab = keyof typeof contentMap

export interface SettingsContentProps {
  activeTab: Tab
}

export function SettingsContent({ activeTab }: SettingsContentProps) {
  const ContentComponent = contentMap[activeTab]

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          <ContentComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}