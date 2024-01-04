import { useState } from "react";
import { motion } from "framer-motion";

interface ToastProps {
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const useToast = () => {
  const [showToast, setShowToast] = useState(false);
  const [toastProps, setToastProps] = useState<ToastProps>({ message: "" });

  const Toast: React.FC = () => {
    if (!showToast) return null;

    const handleConfirm = () => {
      toastProps.onConfirm?.();
      setShowToast(false);
    };

    const handleCancel = () => {
      toastProps.onCancel?.();
      setShowToast(false);
    };

    const variants = {
      open: { opacity: 1, y: 0 },
      closed: { opacity: 0, y: "-100%" },
    };

    return (
      <motion.div
        className="fixed inset-0 flex items-start top-1/4 justify-center z-50"
        initial="closed"
        animate={showToast ? "open" : "closed"}
        variants={variants}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white p-8 rounded-lg shadow-xl border border-zinc-300">
          <p className="text-lg w-56 text-zinc-800">{toastProps.message}</p>
          <div className="flex justify-between mt-4">
            {toastProps.onCancel && (
              <button
                className="px-8 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                onClick={handleCancel}
              >
                {toastProps.cancelText || "Cancel"}
              </button>
            )}
            <button
              className="px-8 py-2 ml-2 text-white bg-blue-500 rounded hover:bg-blue-600"
              onClick={handleConfirm}
            >
              {toastProps.confirmText || "Confirm"}
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  const openToast = (
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    confirmText?: string,
    cancelText?: string
  ) => {
    setToastProps({ message, onConfirm, onCancel, confirmText, cancelText });
    setShowToast(true);
  };

  return { Toast, openToast };
};
