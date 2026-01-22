"use client";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--card-border)]">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">😐</span>
            <h1 className="text-xl font-bold text-white">
              Wojak<span className="text-[var(--accent)]">News</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://jup.ag/tokens/8J69rbLTzWWgUJziFY8jeu5tDwEPBwUz4pKBMr5rpump"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-black font-semibold rounded-lg transition-colors"
            >
              Buy Wojak
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
