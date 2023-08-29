import React, { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

type InfiniteLoaderProps = {
  children: React.ReactNode;
  isLoading: boolean;
  currentItemCount: number;
  maxItemCount: number;
  loadMoreItems: () => void;
};

export function InfiniteLoader({
  children,
  isLoading,
  loadMoreItems,
  currentItemCount,
  maxItemCount,
}: InfiniteLoaderProps) {
  const endOfListRef = useRef<HTMLElement>(null);
  const noMoreItems = currentItemCount >= maxItemCount;

  // fix fast scrolling
  const debouncedFetchImages = useDebouncedCallback(loadMoreItems, 100);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (noMoreItems) return;

        if (entries[0].isIntersecting) {
          debouncedFetchImages();
        }
      },
      { rootMargin: "0px 0px 500px 0px" }
    );

    if (endOfListRef.current && !noMoreItems) {
      observer.observe(endOfListRef.current);
    }

    return () => {
      if (endOfListRef.current) {
        observer.unobserve(endOfListRef.current);
      }
    };
  }, [endOfListRef, noMoreItems]);

  return (
    <>
      {children}
      {isLoading && (
        <p style={{ width: "100%", textAlign: "center" }}>Loading...</p>
      )}
      {noMoreItems && (
        <p style={{ width: "100%", textAlign: "center" }}>No more items</p>
      )}
      <span ref={endOfListRef}></span>
    </>
  );
}
