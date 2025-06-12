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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Create New API Key</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="keyName" className="block text-sm font-medium text-gray-700 mb-1">
                Key Name
              </label>
              <input
                id="keyName"
                type="text"
                placeholder="Enter key name"
                className={`w-full border rounded-lg px-3 py-2 ${
                  createError ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all`}
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
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createApiKey}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
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