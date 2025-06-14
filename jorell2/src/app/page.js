import Image from "next/image";
import Sidebar from "../components/Sidebar";

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-[#f5f5f5]">
        {/* Header Card with Gradient */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-400 to-blue-400 p-8 rounded-b-3xl shadow-lg">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-4">Welcome to BA Sensei Keys</h1>
              <p className="text-white/80 text-lg max-w-2xl">Easily manage your API keys, monitor usage, and control access for your applications. Use the sidebar to navigate between the main page and your API keys.</p>
            </div>
          </div>
        </div>
        <main className="max-w-6xl mx-auto px-8 -mt-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-2xl font-semibold text-gray-800">Get Started</h2>
              <p className="text-gray-700 text-[15px]">Use the navigation on the left to access your API keys or return to this main page. Here you can find information about your account, usage, and more features coming soon.</p>
              <div className="flex gap-4 mt-4">
                <a
                  className="rounded-lg bg-purple-600 text-white px-5 py-2.5 font-medium hover:bg-purple-700 transition-colors"
                  href="/api-keys"
                >
                  Manage API Keys
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
