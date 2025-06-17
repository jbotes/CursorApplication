import { useState } from 'react';

export const CreateApiKeyModal = ({ isOpen, onClose, onCreate }) => {
  const [newKeyName, setNewKeyName] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState(1000);
  const [hasLimit, setHasLimit] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async () => {
    if (!newKeyName.trim()) {
      setError("Please enter a key name");
      return;
    }

    const result = await onCreate(newKeyName, hasLimit ? monthlyLimit : null);
    
    if (result.success) {
      setNewKeyName("");
      setMonthlyLimit(1000);
      setHasLimit(false);
      onClose();
    } else {
      setError(result.error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCreate();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-[440px] shadow-xl">
        <h2 className="text-[22px] font-semibold text-gray-900 mb-2">Create a new API key</h2>
        <p className="text-gray-700 text-[15px] mb-6">
          Enter a name and limit for the new API key.
        </p>

        <div className="space-y-6">
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <label htmlFor="keyName" className="block text-[15px] font-medium text-gray-900">
                Key Name
              </label>
              <span className="text-gray-600 text-sm">— A unique name to identify this key</span>
            </div>
            <input
              id="keyName"
              type="text"
              placeholder="Key Name"
              className={`w-full border rounded-lg px-4 py-2.5 text-gray-900 ${
                error ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[15px]`}
              value={newKeyName}
              onChange={(e) => {
                setNewKeyName(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyPress}
              autoFocus
            />
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
            )}
          </div>

          <div>
            <label className="inline-flex items-center mb-3">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={hasLimit}
                onChange={(e) => setHasLimit(e.target.checked)}
              />
              <span className="ml-2 text-[15px] text-gray-900">Limit monthly usage*</span>
            </label>
            {hasLimit && (
              <input
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-900 text-[15px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="1000"
              />
            )}
            <p className="mt-2 text-[13px] text-gray-600">
              *If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-[15px] text-gray-700 hover:text-gray-900 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-[15px] font-medium"
            disabled={!newKeyName.trim()}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}; 