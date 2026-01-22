export interface Tweet {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  text: string;
  imageUrl: string;
  tweetUrl: string;
}
