import Link from "next/link";

export default function APIKeysPage() {
  return (
    <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center sm:items-start">
        <h1 className="text-4xl font-bold text-center sm:text-left">
          Welcome to the API Keys Page
        </h1>
        <Link
          href="/"
          className="rounded-full bg-red-600 text-white border border-solid border-transparent transition-colors flex items-center justify-center hover:bg-red-700 font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-auto"
        >
          Take me Back!
        </Link>
      </main>
    </div>
  );
} 