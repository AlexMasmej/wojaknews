import { NewsFeed } from "@/components";
import { getSavedTweets } from "@/lib/fetchTweets";

export default function Home() {
  const tweets = getSavedTweets();

  return (
    <div className="min-h-screen">
      <NewsFeed initialTweets={tweets} />
    </div>
  );
}
