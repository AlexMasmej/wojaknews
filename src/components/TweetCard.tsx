"use client";

import { Tweet } from "@/types";
import Image from "next/image";

interface TweetCardProps {
  tweet: Tweet;
}

export function TweetCard({ tweet }: TweetCardProps) {
  if (!tweet.imageUrl) return null;

  return (
    <a
      href={tweet.tweetUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative overflow-hidden hover:opacity-90 transition-opacity"
    >
      <Image
        src={tweet.imageUrl}
        alt={tweet.text}
        width={600}
        height={600}
        className="w-full h-full object-cover"
      />
    </a>
  );
}
