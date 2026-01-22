import { Tweet } from "@/types";
import savedTweets from "@/data/tweets.json";

interface SavedTweet {
  id: string;
  text: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  imageUrl: string;
}

export function getSavedTweets(): Tweet[] {
  return (savedTweets as SavedTweet[]).map((tweet) => ({
    id: tweet.id,
    author: {
      name: tweet.authorName,
      handle: tweet.authorHandle,
      avatar: tweet.authorAvatar,
    },
    text: tweet.text,
    imageUrl: tweet.imageUrl,
    tweetUrl: `https://x.com/${tweet.authorHandle}/status/${tweet.id}`,
  }));
}
