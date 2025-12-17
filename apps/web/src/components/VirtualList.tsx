'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';

/**
 * Virtual list item props
 */
export interface VirtualListItemProps<T> {
  item: T;
  index: number;
  style: React.CSSProperties;
}

/**
 * Virtual list props
 */
export interface VirtualListProps<T> {
  items?: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (props: VirtualListItemProps<T>) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  overscan?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  ListEmptyComponent?: React.ReactNode;
  loading?: boolean;
  estimatedItemHeight?: number;
}

/**
 * Virtual List Component
 * Renders only visible items for performance with large datasets
 */
export function VirtualList<T>({
  items = [],
  itemHeight,
  containerHeight,
  renderItem,
  keyExtractor,
  className = '',
  overscan = 3,
  onEndReached,
  onEndReachedThreshold = 0.8,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  loading = false,
}: VirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  );

  // Total height of all items
  const totalHeight = items.length * itemHeight;

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);

    // Check if we've reached the end
    if (onEndReached) {
      const scrollHeight = target.scrollHeight;
      const scrollTop = target.scrollTop;
      const clientHeight = target.clientHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage >= onEndReachedThreshold) {
        onEndReached();
      }
    }
  }, [onEndReached, onEndReachedThreshold]);

  // Render visible items
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const item = items[i];
    if (!item) continue;

    const style: React.CSSProperties = {
      position: 'absolute',
      top: i * itemHeight,
      left: 0,
      right: 0,
      height: itemHeight,
    };

    visibleItems.push(
      <div key={keyExtractor(item, i)} style={style}>
        {renderItem({ item, index: i, style })}
      </div>
    );
  }

  // Show empty state
  if (items.length === 0 && !loading && ListEmptyComponent) {
    return (
      <div className={className} style={{ height: containerHeight }}>
        {ListEmptyComponent}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      {ListHeaderComponent}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>
      {loading && ListFooterComponent}
      {!loading && ListFooterComponent}
    </div>
  );
}

/**
 * Infinite scroll virtual list props
 */
export interface InfiniteVirtualListProps<T> {
  queryKey: any[];
  fetchPage: (params: { pageParam?: any }) => Promise<{
    data: T[];
    nextCursor?: any;
    hasNextPage: boolean;
  }>;
  itemHeight: number;
  containerHeight: number;
  renderItem: (props: VirtualListItemProps<T>) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  overscan?: number;
  ListHeaderComponent?: React.ReactNode;
  ListFooterComponent?: React.ReactNode;
  ListEmptyComponent?: React.ReactNode;
  LoadingComponent?: React.ReactNode;
  ErrorComponent?: (error: Error, retry: () => void) => React.ReactNode;
}

/**
 * Infinite Virtual List Component
 * Combines virtual scrolling with infinite scroll/pagination
 */
export function InfiniteVirtualList<T>({
  queryKey,
  fetchPage,
  itemHeight,
  containerHeight,
  renderItem,
  keyExtractor,
  className = '',
  overscan = 3,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  LoadingComponent,
  ErrorComponent,
}: InfiniteVirtualListProps<T>) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey,
    queryFn: fetchPage,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextCursor : undefined,
    initialPageParam: undefined,
  });

  // Flatten all pages into single array
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  // Handle end reached
  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Loading state
  if (isLoading && LoadingComponent) {
    return (
      <div className={className} style={{ height: containerHeight }}>
        {LoadingComponent}
      </div>
    );
  }

  // Error state
  if (isError && ErrorComponent) {
    return (
      <div className={className} style={{ height: containerHeight }}>
        {ErrorComponent(error as Error, refetch)}
      </div>
    );
  }

  return (
    <VirtualList
      items={items}
      itemHeight={itemHeight}
      containerHeight={containerHeight}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      className={className}
      overscan={overscan}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.8}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={
        isFetchingNextPage ? (
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
          </div>
        ) : (
          ListFooterComponent
        )
      }
      ListEmptyComponent={ListEmptyComponent}
      loading={isFetchingNextPage}
    />
  );
}

/**
 * Dynamic height virtual list (for variable item heights)
 */
export interface DynamicVirtualListProps<T> {
  items: T[];
  estimatedItemHeight: number;
  containerHeight: number;
  renderItem: (props: VirtualListItemProps<T>) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  overscan?: number;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

export function DynamicVirtualList<T>({
  items,
  estimatedItemHeight,
  containerHeight,
  renderItem,
  keyExtractor,
  className = '',
  overscan = 3,
  onEndReached,
  onEndReachedThreshold = 0.8,
}: DynamicVirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState<Map<number, number>>(new Map());
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Measure item heights
  useEffect(() => {
    const newHeights = new Map<number, number>();
    itemRefs.current.forEach((element, index) => {
      if (element) {
        newHeights.set(index, element.offsetHeight);
      }
    });
    setItemHeights(newHeights);
  }, [items]);

  // Calculate positions
  const getItemOffset = (index: number): number => {
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += itemHeights.get(i) || estimatedItemHeight;
    }
    return offset;
  };

  const getTotalHeight = (): number => {
    let height = 0;
    for (let i = 0; i < items.length; i++) {
      height += itemHeights.get(i) || estimatedItemHeight;
    }
    return height;
  };

  // Find visible range
  const findVisibleRange = (): [number, number] => {
    let startIndex = 0;
    let currentOffset = 0;

    // Find start index
    for (let i = 0; i < items.length; i++) {
      const height = itemHeights.get(i) || estimatedItemHeight;
      if (currentOffset + height >= scrollTop) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
      currentOffset += height;
    }

    // Find end index
    let endIndex = startIndex;
    currentOffset = getItemOffset(startIndex);
    const viewportEnd = scrollTop + containerHeight;

    for (let i = startIndex; i < items.length; i++) {
      const height = itemHeights.get(i) || estimatedItemHeight;
      if (currentOffset >= viewportEnd) {
        break;
      }
      endIndex = i;
      currentOffset += height;
    }

    return [startIndex, Math.min(items.length - 1, endIndex + overscan)];
  };

  const [startIndex, endIndex] = findVisibleRange();

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    setScrollTop(target.scrollTop);

    if (onEndReached) {
      const scrollHeight = target.scrollHeight;
      const scrollTop = target.scrollTop;
      const clientHeight = target.clientHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      if (scrollPercentage >= onEndReachedThreshold) {
        onEndReached();
      }
    }
  }, [onEndReached, onEndReachedThreshold]);

  // Render visible items
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    const item = items[i];
    if (!item) continue;

    const top = getItemOffset(i);
    const style: React.CSSProperties = {
      position: 'absolute',
      top,
      left: 0,
      right: 0,
    };

    visibleItems.push(
      <div
        key={keyExtractor(item, i)}
        ref={(el) => {
          if (el) itemRefs.current.set(i, el);
        }}
        style={style}
      >
        {renderItem({ item, index: i, style })}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: getTotalHeight(), position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  );
}

/**
 * Grid virtual list for multi-column layouts
 */
export interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  columns: number;
  containerHeight: number;
  renderItem: (props: VirtualListItemProps<T>) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  className?: string;
  gap?: number;
  overscan?: number;
}

export function VirtualGrid<T>({
  items,
  itemHeight,
  itemWidth,
  columns,
  containerHeight,
  renderItem,
  keyExtractor,
  className = '',
  gap = 0,
  overscan = 3,
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);

  const rowHeight = itemHeight + gap;
  const totalRows = Math.ceil(items.length / columns);
  const totalHeight = totalRows * rowHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const endRow = Math.min(
    totalRows - 1,
    Math.ceil((scrollTop + containerHeight) / rowHeight) + overscan
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop((e.target as HTMLDivElement).scrollTop);
  }, []);

  const visibleItems = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      if (index >= items.length) break;

      const item = items[index];
      const style: React.CSSProperties = {
        position: 'absolute',
        top: row * rowHeight,
        left: col * (itemWidth + gap),
        width: itemWidth,
        height: itemHeight,
      };

      visibleItems.push(
        <div key={keyExtractor(item, index)} style={style}>
          {renderItem({ item, index, style })}
        </div>
      );
    }
  }

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  );
}

export default VirtualList;
