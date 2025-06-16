import { useState } from 'react';

export const ApiKeyTable = ({ apiKeys, onUpdate, onDelete, onCopy }) => {
  const [editingKey, setEditingKey] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editError, setEditError] = useState("");
  const [visibleKeys, setVisibleKeys] = useState(new Set());

  const maskApiKey = (key) => {
    if (visibleKeys.has(key.id)) {
      return key.key;
    }
    return key.key.slice(0, -5) + '*****';
  };

  const toggleKeyVisibility = (keyId) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const startEditing = (key) => {
    setEditingKey(key.id);
    setEditingName(key.name);
    setEditError("");
  };

  const cancelEditing = () => {
    setEditingKey(null);
    setEditingName("");
    setEditError("");
  };

  const handleEditKeyPress = async (e, id) => {
    if (e.key === 'Enter') {
      await handleUpdate(id);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleUpdate = async (id) => {
    if (!editingName.trim()) {
      setEditError("Name cannot be empty");
      return;
    }

    const result = await onUpdate(id, editingName);
    if (result.success) {
      cancelEditing();
    } else {
      setEditError(result.error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">NAME</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">USAGE</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">KEY</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">OPTIONS</th>
          </tr>
        </thead>
        <tbody>
          {apiKeys.map((key) => (
            <tr key={key.id} className="border-b border-gray-50 hover:bg-gray-50/50">
              <td className="py-3 px-4">
                {editingKey === key.id ? (
                  <div className="flex flex-col gap-1">
                    <input
                      type="text"
                      className={`border rounded px-3 py-1.5 w-full text-sm ${
                        editError ? 'border-red-500' : 'border-gray-300'
                      }`}
                      value={editingName}
                      onChange={(e) => {
                        setEditingName(e.target.value);
                        setEditError("");
                      }}
                      onKeyDown={(e) => handleEditKeyPress(e, key.id)}
                      autoFocus
                    />
                    {editError && (
                      <span className="text-xs text-red-600">{editError}</span>
                    )}
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => handleUpdate(key.id)}
                        className="text-xs text-green-600 hover:text-green-800"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="text-xs text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-900 font-medium">{key.name}</span>
                )}
              </td>
              <td className="py-3 px-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-900">{key.current_usage || 0}</span>
                  {key.monthly_limit && (
                    <span className="text-xs text-gray-500">
                      Limit: {key.monthly_limit}
                    </span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <code className="text-sm text-red-600 font-mono bg-gray-50 px-2 py-1 rounded">
                  {maskApiKey(key)}
                </code>
              </td>
              <td className="py-3 px-4 text-right space-x-2">
                <button
                  className="text-gray-400 hover:text-gray-600"
                  title={visibleKeys.has(key.id) ? "Hide API Key" : "Show API Key"}
                  onClick={() => toggleKeyVisibility(key.id)}
                >
                  {visibleKeys.has(key.id) ? '👁️' : '👁️‍🗨️'}
                </button>
                <button
                  className="text-gray-400 hover:text-gray-600"
                  title="Copy"
                  onClick={() => onCopy(key.key)}
                >
                  📋
                </button>
                {editingKey === key.id ? (
                  <span className="text-sm text-gray-400">Editing...</span>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(key)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => onDelete(key.id)}
                      className="text-gray-400 hover:text-gray-600"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {apiKeys.length === 0 && (
            <tr>
              <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                No API keys found. Create one to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}; 