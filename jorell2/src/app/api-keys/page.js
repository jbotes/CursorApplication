'use client';

import { useState } from "react";
import Link from "next/link";

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [editingKey, setEditingKey] = useState(null);
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

  const updateApiKey = (id, newName) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, name: newName } : key
    ));
    setEditingKey(null);
  };

  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center sm:items-start max-w-6xl mx-auto">
        <div className="w-full flex justify-between items-center">
          <h1 className="text-4xl font-bold">API Keys</h1>
          <div className="flex gap-4">
            <Link
              href="/"
              className="rounded-full bg-gray-600 text-white border border-solid border-transparent transition-colors flex items-center justify-center hover:bg-gray-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Back
            </Link>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-full bg-blue-600 text-white border border-solid border-transparent transition-colors flex items-center justify-center hover:bg-blue-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            >
              Create new API Key
            </button>
          </div>
        </div>

        {/* Search Box */}
        <div className="w-full">
          <input
            type="text"
            placeholder="Type here..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        {/* API Keys Table */}
        <div className="w-full overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Key</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Used</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.map((key) => (
                <tr key={key.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingKey === key.id ? (
                      <input
                        type="text"
                        className="border rounded px-2 py-1"
                        defaultValue={key.name}
                        onBlur={(e) => updateApiKey(key.id, e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && updateApiKey(key.id, e.target.value)}
                      />
                    ) : (
                      <span className="text-sm text-gray-900">{key.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded text-red-600 font-medium">{key.key}</code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(key.created).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setEditingKey(key.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteApiKey(key.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {apiKeys.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No API keys found. Create one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Create API Key Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New API Key</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
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
                  className={`w-full border rounded px-3 py-2 ${
                    createError ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
                  value={newKeyName}
                  onChange={(e) => {
                    setNewKeyName(e.target.value);
                    setCreateError(""); // Clear error when user types
                  }}
                  onKeyDown={handleCreateKeyPress}
                  autoFocus
                />
                {createError && (
                  <p className="mt-1 text-sm text-red-600">{createError}</p>
                )}
              </div>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={createApiKey}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!newKeyName.trim()}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 