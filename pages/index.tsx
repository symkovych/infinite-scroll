import Head from "next/head";
import styles from "../styles/Home.module.css";
import { InfiniteLoader } from "../src/components/InfiniteLoader";
import { useRef, useState } from "react";
import GridItem from "../src/components/GridItem";
import parse from "parse-link-header";

const baseUrl = "https://picsum.photos/v2/list?page=1&limit=20";
const pagintaionHeaderKey = "link";
// hardcoded because the api doesn't return it
const maxItemCount = 160;

export type ImageData = {
  id: number;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
};

export default function Home() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const nextPageUrl = useRef(baseUrl);

  const updateNextPageURL = (headers: Headers) => {
    const linkHeader = headers.get(pagintaionHeaderKey);
    const parsedLink = parse(linkHeader);
    nextPageUrl.current = parsedLink.next.url;
  };

  const fetchImages = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await fetch(nextPageUrl.current);
      updateNextPageURL(response.headers);

      const json: ImageData[] = await response.json();
      await setImages((prevImages) => [...prevImages, ...json]);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Head>
        <title>Infinite loader</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <InfiniteLoader
          isLoading={isLoading}
          currentItemCount={images.length}
          maxItemCount={maxItemCount}
          loadMoreItems={fetchImages}
        >
          <div className={styles.grid}>
            {images.map((image) => (
              <GridItem key={image.id} {...image} />
            ))}
          </div>
        </InfiniteLoader>
      </main>
    </div>
  );
}
