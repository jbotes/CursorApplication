export const Toast = ({ message, type = 'success', onClose }) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✔️';
      case 'error':
        return '❌';
      case 'delete':
        return '🗑️';
      default:
        return 'ℹ️';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'delete':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-gray-100 border border-gray-300 text-gray-900 px-6 py-3 rounded-xl shadow flex items-center gap-3 min-w-[280px] max-w-[90vw]">
      <span className={`${getColor()} text-xl`}>{getIcon()}</span>
      <span className="flex-1 text-[15px] font-medium">{message}</span>
      <button
        className="ml-2 text-gray-500 hover:text-gray-700 text-lg"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}; 