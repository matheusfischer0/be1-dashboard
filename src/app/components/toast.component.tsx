import { useState } from 'react'
import { motion } from 'framer-motion'

interface ToastProps {
  message: string
  onConfirm: () => void
  onCancel?: () => void
}

export const useToast = () => {
  const [showToast, setShowToast] = useState(false)
  const [toastProps, setToastProps] = useState<ToastProps>({
    message: '',
    onConfirm: () => { },
  })

  const Toast: React.FC<ToastProps> = ({ message, onConfirm, onCancel }) => {
    if (!showToast) return null

    const handleConfirm = () => {
      onConfirm()
      setShowToast(false)
    }

    const handleCancel = () => {
      if (onCancel) {
        onCancel()
      }
      setShowToast(false)
    }

    const variants = {
      open: { opacity: 1, y: 0 },
      closed: { opacity: 0, y: 0 },
    }

    return (
      <motion.div
        className="fixed inset-0 flex items-start top-1/4 justify-center z-50"
        initial="closed"
        animate={showToast ? 'open' : 'closed'}
        variants={variants}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white p-8 rounded-lg shadow-xl border border-zinc-300">
          <p className="text-lg w-56">{message}</p>
          <div className="flex justify-between mt-4">
            {onCancel && (
              <button
                className="px-8 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleCancel}
              >
                Não
              </button>
            )}
            <button
              className="px-8 py-2 mr-2 text-white bg-red-500 rounded hover:bg-red-600"
              onClick={handleConfirm}
            >
              Sim
            </button>
          </div>
        </div>
      </motion.div>
    )
  }

  const openToast = (
    message: string,
    onConfirm: () => void,
    onCancel?: () => void,
  ) => {
    setToastProps({ message, onConfirm, onCancel })
    setShowToast(true)
  }

  return { Toast, openToast }
}
