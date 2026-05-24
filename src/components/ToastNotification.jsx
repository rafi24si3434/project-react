import { useEffect } from "react";
import { FiCheckCircle, FiXCircle, FiX } from "react-icons/fi";

export default function ToastNotification({ message, type = "success", isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-gray-100 p-4 rounded-2xl shadow-xl transform transition-all animate-bounce-in">
      {type === "success" ? (
        <FiCheckCircle className="text-emerald-500 text-xl" />
      ) : (
        <FiXCircle className="text-red-500 text-xl" />
      )}
      <p className="text-sm font-medium text-gray-800 mr-4">{message}</p>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
        <FiX size={16} />
      </button>
    </div>
  );
}
