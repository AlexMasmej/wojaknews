"use client";

import { Tweet } from "@/types";
import { TweetCard } from "./TweetCard";
import { useEffect, useState } from "react";

interface NewsFeedProps {
  initialTweets: Tweet[];
}

const BuyButton = ({ row }: { row: number }) => (
  <a
    href="https://jup.ag/tokens/8J69rbLTzWWgUJziFY8jeu5tDwEPBwUz4pKBMr5rpump"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      top: `calc(${row} * (100vw / 3))`,
    }}
    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-6 py-3 bg-black text-white font-bold rounded-full shadow-lg hover:bg-gray-800 transition-colors md:hidden"
  >
    Buy Wojak
  </a>
);

const BuyButtonMd = ({ row }: { row: number }) => (
  <a
    href="https://jup.ag/tokens/8J69rbLTzWWgUJziFY8jeu5tDwEPBwUz4pKBMr5rpump"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      top: `calc(${row} * (100vw / 5))`,
    }}
    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-6 py-3 bg-black text-white font-bold rounded-full shadow-lg hover:bg-gray-800 transition-colors hidden md:block lg:hidden"
  >
    Buy Wojak
  </a>
);

const BuyButtonLg = ({ row }: { row: number }) => (
  <a
    href="https://jup.ag/tokens/8J69rbLTzWWgUJziFY8jeu5tDwEPBwUz4pKBMr5rpump"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      top: `calc(${row} * (100vw / 6))`,
    }}
    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-6 py-3 bg-black text-white font-bold rounded-full shadow-lg hover:bg-gray-800 transition-colors hidden lg:block xl:hidden"
  >
    Buy Wojak
  </a>
);

const BuyButtonXl = ({ row }: { row: number }) => (
  <a
    href="https://jup.ag/tokens/8J69rbLTzWWgUJziFY8jeu5tDwEPBwUz4pKBMr5rpump"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      top: `calc(${row} * (100vw / 8))`,
    }}
    className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 px-6 py-3 bg-black text-white font-bold rounded-full shadow-lg hover:bg-gray-800 transition-colors hidden xl:block"
  >
    Buy Wojak
  </a>
);

export function NewsFeed({ initialTweets }: NewsFeedProps) {
  const [tweets, setTweets] = useState<Tweet[]>(initialTweets);

  useEffect(() => {
    // Auto-refresh every hour
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/tweets");
        if (res.ok) {
          const data = await res.json();
          if (data.tweets && data.tweets.length > 0) {
            setTweets(data.tweets);
          }
        }
      } catch (error) {
        console.error("Failed to refresh tweets:", error);
      }
    }, 60 * 60 * 1000); // 1 hour

    return () => clearInterval(interval);
  }, []);

  const tweetsWithImages = tweets.filter((tweet) => tweet.imageUrl);

  // Group by author
  const byAuthor: Record<string, Tweet[]> = {};
  tweetsWithImages.forEach((tweet) => {
    const handle = tweet.author.handle;
    if (!byAuthor[handle]) byAuthor[handle] = [];
    byAuthor[handle].push(tweet);
  });

  // Interleave tweets from different authors
  const handles = Object.keys(byAuthor);
  const mixed: Tweet[] = [];
  const maxLen = Math.max(...handles.map((h) => byAuthor[h].length));

  for (let i = 0; i < maxLen; i++) {
    for (const handle of handles) {
      if (byAuthor[handle][i]) {
        mixed.push(byAuthor[handle][i]);
      }
    }
  }

  // Calculate number of rows for each breakpoint
  const totalItems = mixed.length;
  const rowsMobile = Math.ceil(totalItems / 3);
  const rowsMd = Math.ceil(totalItems / 5);
  const rowsLg = Math.ceil(totalItems / 6);
  const rowsXl = Math.ceil(totalItems / 8);

  return (
    <div className="relative">
      {/* Buy buttons at each row intersection for mobile (3 cols) */}
      {Array.from({ length: rowsMobile - 1 }, (_, i) => (
        <BuyButton key={`mobile-${i}`} row={i + 1} />
      ))}
      {/* Buy buttons for md (5 cols) */}
      {Array.from({ length: rowsMd - 1 }, (_, i) => (
        <BuyButtonMd key={`md-${i}`} row={i + 1} />
      ))}
      {/* Buy buttons for lg (6 cols) */}
      {Array.from({ length: rowsLg - 1 }, (_, i) => (
        <BuyButtonLg key={`lg-${i}`} row={i + 1} />
      ))}
      {/* Buy buttons for xl (8 cols) */}
      {Array.from({ length: rowsXl - 1 }, (_, i) => (
        <BuyButtonXl key={`xl-${i}`} row={i + 1} />
      ))}
      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-0.5">
        {mixed.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
}
