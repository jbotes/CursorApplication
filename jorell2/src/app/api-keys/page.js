'use client';

import { useState } from "react";
import Link from "next/link";

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [editingKey, setEditingKey] = useState(null);

  // Mock functions for CRUD operations - replace with actual API calls
  const createApiKey = () => {
    if (!newKeyName.trim()) return;
    const newKey = {
      id: Date.now(),
      name: newKeyName,
      key: `key_${Math.random().toString(36).substr(2, 9)}`,
      created: new Date().toISOString(),
      lastUsed: null
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setIsCreateModalOpen(false);
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
                    <code className="text-sm bg-gray-100 px-2 py-1 rounded">{key.key}</code>
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
              <h2 className="text-xl font-bold mb-4">Create New API Key</h2>
              <input
                type="text"
                placeholder="Enter key name"
                className="w-full border rounded px-3 py-2 mb-4"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={createApiKey}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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