export const HeaderCard = () => {
  return (
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
  );
}; 