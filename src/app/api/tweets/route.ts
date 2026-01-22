import { NextResponse } from "next/server";
import { fetchAllAccountsTweets } from "@/lib/tweetFetcher";

export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    // Fetch tweets from all accounts
    const allTweets = await fetchAllAccountsTweets();

    // Filter to only tweets with images
    const tweetsWithImages = allTweets.filter((tweet) => tweet.imageUrl);

    // Sort by ID (newest first)
    tweetsWithImages.sort((a, b) => {
      if (BigInt(b.id) > BigInt(a.id)) return 1;
      if (BigInt(b.id) < BigInt(a.id)) return -1;
      return 0;
    });

    return NextResponse.json({
      tweets: tweetsWithImages,
      count: tweetsWithImages.length,
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
