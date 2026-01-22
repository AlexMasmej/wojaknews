"use client";

import { Tweet } from "@/types";
import { TweetCard } from "./TweetCard";
import { useEffect, useState } from "react";

interface NewsFeedProps {
  initialTweets: Tweet[];
}

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

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-0.5">
      {mixed.map((tweet) => (
        <TweetCard key={tweet.id} tweet={tweet} />
      ))}
    </div>
  );
}
