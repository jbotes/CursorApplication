'use client';

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { HeaderCard } from "../../components/HeaderCard";
import { ApiKeyTable } from "../../components/ApiKeyTable";
import { CreateApiKeyModal } from "../../components/CreateApiKeyModal";
import { Toast } from "../../components/Toast";
import { useApiKeys } from "../../hooks/useApiKeys";

export default function APIKeysPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const {
    apiKeys,
    isLoading,
    error,
    createApiKey,
    updateApiKey,
    deleteApiKey
  } = useApiKeys();

  const handleCreateKey = async (name, monthlyLimit) => {
    const result = await createApiKey(name, monthlyLimit);
    if (result.success) {
      setToastMessage("API Key created successfully");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
    return result;
  };

  const handleUpdateKey = async (id, name) => {
    return await updateApiKey(id, name);
  };

  const handleDeleteKey = async (id) => {
    const result = await deleteApiKey(id);
    if (result.success) {
      setToastMessage("API Key deleted");
      setShowDeleteToast(true);
      setTimeout(() => setShowDeleteToast(false), 2000);
    }
    return result;
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    setToastMessage("Copied API Key to clipboard");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-[#f5f5f5]">
        {/* Toast Notifications */}
        {showToast && (
          <Toast
            message={toastMessage}
            type="success"
            onClose={() => setShowToast(false)}
          />
        )}
        {showDeleteToast && (
          <Toast
            message="API Key deleted"
            type="delete"
            onClose={() => setShowDeleteToast(false)}
          />
        )}

        <HeaderCard />

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

            {isLoading ? (
              <div className="text-center py-8">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : (
              <ApiKeyTable
                apiKeys={apiKeys}
                onUpdate={handleUpdateKey}
                onDelete={handleDeleteKey}
                onCopy={handleCopyKey}
              />
            )}
          </div>
        </main>

        <CreateApiKeyModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateKey}
        />
      </div>
    </div>
  );
} 