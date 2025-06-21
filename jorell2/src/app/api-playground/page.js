'use client';

import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import { HeaderCard } from "../../components/HeaderCard";
import { Toast } from "../../components/Toast";
import { supabase } from '@/lib/supabase';

export default function ApiPlaygroundPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!requestBody.trim()) return;
    
    setIsLoading(true);
    try {
      // Check if the API key exists in the database
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key', requestBody.trim())
        .single();

      if (error) throw error;

      if (data) {
        // API key found
        setResponse({
          status: 200,
          data: {
            message: "API Key valid!",
            key: data.key,
            name: data.name,
            monthly_limit: data.monthly_limit,
            current_usage: data.current_usage,
            created_at: data.created_at
          }
        });
        setToastMessage("API Key valid!");
        setShowToast(true);
      } else {
        // API key not found
        setResponse({
          status: 404,
          error: "API Key not valid"
        });
        setToastMessage("API Key not valid");
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error validating API key:', error);
      setResponse({
        status: 500,
        error: "Failed to validate API key"
      });
      setToastMessage("Failed to validate API key");
      setShowToast(true);
    } finally {
      setIsLoading(false);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const isButtonDisabled = !requestBody.trim() || isLoading;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-[#f5f5f5]">
        {/* Toast Notification */}
        {showToast && (
          <Toast
            message={toastMessage}
            type={response?.status === 200 ? "success" : "error"}
            onClose={() => setShowToast(false)}
          />
        )}

        <HeaderCard />

        <main className="max-w-6xl mx-auto px-8 -mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">API Playground</h2>
            </div>

            <p className="text-gray-600 text-sm mb-6">
              Test and experiment with our API directly in your browser.
              Use this page to validate the API key.
            </p>

            {/* Request Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Request</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Request Body (JSON)
                    </label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      className="w-full h-48 p-3 border border-gray-300 rounded-lg font-mono text-sm text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your request body in JSON format..."
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                    className={`w-full py-2 px-4 rounded-lg transition-colors ${
                      isButtonDisabled
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? "Validating..." : "Validate API Key"}
                  </button>
                </div>
              </div>

              {/* Response Section */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Response</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  {response ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          response.status === 200
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          Status: {response.status}
                        </span>
                      </div>
                      <pre className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                        <code>{JSON.stringify(response.data || response.error, null, 2)}</code>
                      </pre>
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm italic">
                      Response will appear here after making a request
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 