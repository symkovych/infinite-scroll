import React, { memo } from "react";
import { ImageData } from "../../../pages";
import Image from "next/image";
import styles from "../../../styles/Home.module.css";

const imageReducedWidth = "600";
const grayPlaceholderBase64 =
  "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

const imageLoader = (src) => {
  const srcArray = src.split("/");
  const originalHeight = srcArray[srcArray.length - 1];
  const originalWidth = srcArray[srcArray.length - 2];
  // set the reduced width
  srcArray[srcArray.length - 2] = imageReducedWidth;
  // set the reduced and calculated height, keep the aspect ratio
  srcArray[srcArray.length - 1] = Math.floor(
    (+imageReducedWidth * +originalHeight) / +originalWidth
  ).toString();
  return srcArray.join("/");
};

function GridItem({ author, download_url, id }: ImageData) {
  return (
    <div className={styles["grid-item"]}>
      <div className={styles["image-container"]}>
        <Image
          placeholder="blur"
          blurDataURL={grayPlaceholderBase64}
          alt={author}
          src={download_url}
          key={id}
          loader={() => imageLoader(download_url)}
          fill
          sizes="(max-width: 600px) 50vw, (max-width: 900px) 33vw"
        />
      </div>
      <div className={styles.description}>
        <p>{author}</p>
        <span>#{+id + 1}</span>
      </div>
    </div>
  );
}

export default memo(GridItem);
