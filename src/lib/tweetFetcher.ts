import { Tweet } from "@/types";

interface VxTwitterResponse {
  text?: string;
  user_name?: string;
  user_screen_name?: string;
  user_profile_image_url?: string;
  media_extended?: Array<{
    type: string;
    url: string;
  }>;
}

const ACCOUNTS = ["tyfloki", "NFT_Enjoyer_69", "wojakonx"];

export async function fetchTweetById(
  handle: string,
  tweetId: string
): Promise<Tweet | null> {
  try {
    const res = await fetch(
      `https://api.vxtwitter.com/${handle}/status/${tweetId}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!res.ok) return null;

    const data: VxTwitterResponse = await res.json();

    if (!data.media_extended || data.media_extended.length === 0) return null;

    const imageMedia = data.media_extended.find((m) => m.type === "image");
    if (!imageMedia) return null;

    return {
      id: tweetId,
      author: {
        name: data.user_name || handle,
        handle: data.user_screen_name || handle,
        avatar: data.user_profile_image_url || "",
      },
      text: data.text || "",
      imageUrl: imageMedia.url,
      tweetUrl: `https://x.com/${handle}/status/${tweetId}`,
    };
  } catch (error) {
    console.error(`Failed to fetch tweet ${tweetId}:`, error);
    return null;
  }
}

export async function fetchTweetsFromSyndication(
  handle: string
): Promise<Tweet[]> {
  try {
    const res = await fetch(
      `https://syndication.twitter.com/srv/timeline-profile/screen-name/${handle}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) return [];

    const html = await res.text();
    const scriptMatch = html.match(
      /<script[^>]*id="__NEXT_DATA__"[^>]*>([^<]+)<\/script>/
    );

    if (!scriptMatch) return [];

    const data = JSON.parse(scriptMatch[1]);
    const entries = data?.props?.pageProps?.timeline?.entries || [];

    interface TweetEntry {
      content?: {
        tweet?: {
          id_str: string;
          text: string;
          user: {
            name: string;
            screen_name: string;
            profile_image_url_https: string;
          };
          entities?: { media?: Array<{ media_url_https: string }> };
          extended_entities?: { media?: Array<{ media_url_https: string }> };
        };
      };
    }

    return entries
      .map((entry: TweetEntry) => entry.content?.tweet)
      .filter(Boolean)
      .filter((tweet: NonNullable<TweetEntry["content"]>["tweet"]) => {
        const media =
          tweet?.extended_entities?.media || tweet?.entities?.media;
        return media && media.length > 0;
      })
      .map((tweet: NonNullable<NonNullable<TweetEntry["content"]>["tweet"]>) => {
        const media =
          tweet.extended_entities?.media || tweet.entities?.media;
        return {
          id: tweet.id_str,
          author: {
            name: tweet.user.name,
            handle: tweet.user.screen_name,
            avatar: tweet.user.profile_image_url_https,
          },
          text: tweet.text,
          imageUrl: media?.[0]?.media_url_https || "",
          tweetUrl: `https://x.com/${tweet.user.screen_name}/status/${tweet.id_str}`,
        };
      })
      .slice(0, 20);
  } catch (error) {
    console.error(`Failed to fetch syndication for ${handle}:`, error);
    return [];
  }
}

export async function fetchAllAccountsTweets(): Promise<Tweet[]> {
  const results = await Promise.all(
    ACCOUNTS.map((handle) => fetchTweetsFromSyndication(handle))
  );

  return results.flat();
}

export { ACCOUNTS };
