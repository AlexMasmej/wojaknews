import { NextResponse } from "next/server";
import { isDrawingOrMeme } from "@/lib/imageClassifier";
import { fetchAllAccountsTweets } from "@/lib/tweetFetcher";
import { Tweet } from "@/types";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Fetch tweets from all accounts
    const allTweets = await fetchAllAccountsTweets();

    // Filter to only drawings/memes (not real photos)
    const filteredTweets: Tweet[] = [];

    for (const tweet of allTweets) {
      if (!tweet.imageUrl) continue;

      try {
        const isDrawing = await isDrawingOrMeme(tweet.imageUrl);
        if (isDrawing) {
          filteredTweets.push(tweet);
        }
      } catch {
        // If classification fails, include the tweet anyway
        filteredTweets.push(tweet);
      }
    }

    // Sort by ID (newest first)
    filteredTweets.sort((a, b) => {
      if (BigInt(b.id) > BigInt(a.id)) return 1;
      if (BigInt(b.id) < BigInt(a.id)) return -1;
      return 0;
    });

    return NextResponse.json({
      tweets: filteredTweets,
      count: filteredTweets.length,
      fetchedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to fetch tweets:", error);
    return NextResponse.json(
      { error: "Failed to fetch tweets" },
      { status: 500 }
    );
  }
}
