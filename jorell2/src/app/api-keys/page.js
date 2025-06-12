'use client';

import { useState } from "react";
import Link from "next/link";

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [editingKey, setEditingKey] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editError, setEditError] = useState("");
  const [searchText, setSearchText] = useState("");
  const [createError, setCreateError] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState(1000);
  const [hasLimit, setHasLimit] = useState(false);

  // Mock functions for CRUD operations - replace with actual API calls
  const createApiKey = () => {
    // Reset error state
    setCreateError("");

    // Validate input
    if (!newKeyName.trim()) {
      setCreateError("Please enter a key name");
      return;
    }

    // Check for duplicate names
    if (apiKeys.some(key => key.name.toLowerCase() === newKeyName.trim().toLowerCase())) {
      setCreateError("An API key with this name already exists");
      return;
    }

    try {
      const newKey = {
        id: Date.now(),
        name: newKeyName.trim(),
        key: `key_${Math.random().toString(36).substr(2, 9)}`,
        created: new Date().toISOString(),
        lastUsed: null
      };
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName("");
      setIsCreateModalOpen(false);
    } catch (error) {
      setCreateError("Failed to create API key. Please try again.");
    }
  };

  const handleCreateKeyPress = (e) => {
    if (e.key === 'Enter') {
      createApiKey();
    } else if (e.key === 'Escape') {
      setIsCreateModalOpen(false);
    }
  };

  const deleteApiKey = (id) => {
    setApiKeys(apiKeys.filter(key => key.id !== id));
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

  const updateApiKey = (id) => {
    // Validate input
    if (!editingName.trim()) {
      setEditError("Name cannot be empty");
      return;
    }

    // Check for duplicate names
    if (apiKeys.some(key => key.id !== id && key.name.toLowerCase() === editingName.trim().toLowerCase())) {
      setEditError("An API key with this name already exists");
      return;
    }

    try {
      setApiKeys(apiKeys.map(key => 
        key.id === id ? { ...key, name: editingName.trim() } : key
      ));
      setEditingKey(null);
      setEditingName("");
      setEditError("");
    } catch (error) {
      setEditError("Failed to update API key. Please try again.");
    }
  };

  const handleEditKeyPress = (e, id) => {
    if (e.key === 'Enter') {
      updateApiKey(id);
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header Card with Gradient */}
      <div className="bg-gradient-to-br from-purple-600 via-purple-400 to-blue-400 p-8 rounded-b-3xl shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center text-white/90 hover:text-white mb-6 group transition-colors"
            >
              <svg 
                className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Main Page
            </Link>

            <div className="text-white/80 text-sm font-medium mb-2">CURRENT PLAN</div>
            <h1 className="text-4xl font-bold text-white mb-8">Researcher</h1>
            
            {/* API Limit Bar */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-white/90 text-sm">API Limit</span>
                <span className="text-white/60 text-lg">ⓘ</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full w-[10%] bg-white rounded-full"></div>
              </div>
              <div className="text-white/80 text-sm">24/1,000 Requests</div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-8 -mt-8">
        {/* API Keys Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">API Keys</h2>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span>+</span>
              <span>New API Key</span>
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-6">
            The key is used to authenticate your requests to the Research API. 
            To learn more, see the documentation page.
          </p>

          {/* Table */}
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
                              onClick={() => updateApiKey(key.id)}
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
                      <span className="text-sm text-gray-600">0</span>
                    </td>
                    <td className="py-3 px-4">
                      <code className="text-sm text-red-600 font-mono bg-gray-50 px-2 py-1 rounded">{key.key}</code>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy"
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
                            onClick={() => deleteApiKey(key.id)}
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
        </div>
      </main>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 w-full max-w-[440px] shadow-xl">
            <h2 className="text-[22px] font-semibold text-gray-900 mb-2">Create a new API key</h2>
            <p className="text-gray-700 text-[15px] mb-6">
              Enter a name and limit for the new API key.
            </p>

            <div className="space-y-6">
              {/* Key Name Input */}
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
                    createError ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-[15px]`}
                  value={newKeyName}
                  onChange={(e) => {
                    setNewKeyName(e.target.value);
                    setCreateError("");
                  }}
                  onKeyDown={handleCreateKeyPress}
                  autoFocus
                />
                {createError && (
                  <p className="mt-1 text-sm text-red-600">{createError}</p>
                )}
              </div>

              {/* Monthly Limit */}
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
                  *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-6 py-2.5 text-[15px] text-gray-700 hover:text-gray-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={createApiKey}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-[15px] font-medium"
                disabled={!newKeyName.trim()}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 