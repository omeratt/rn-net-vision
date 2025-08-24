import { useEffect, useRef, useState, useCallback } from 'preact/hooks';
import type { NetVisionLog } from '../types';

export type AnimatedLogPhase = 'normal' | 'entering' | 'exiting';

export interface AnimatedVirtualLog extends NetVisionLog {
  __phase: AnimatedLogPhase;
  __prevIndex?: number;
}

interface Options {
  exitDurationMs?: number;
  enableEnter?: boolean;
  enableLayout?: boolean;
}

export function useAnimatedVirtualLogs(
  logs: NetVisionLog[],
  {
    exitDurationMs = 240,
    enableEnter = true,
    enableLayout = true,
  }: Options = {}
) {
  // Only animate a capped number of items on first paint to avoid main thread thrash
  const INITIAL_ENTER_CAP = 80; // reduced for perf
  const EXIT_CAP = 25; // max concurrent exiting items retained
  const [animatedLogs, setAnimatedLogs] = useState<AnimatedVirtualLog[]>(() =>
    logs.map((l, i) => ({
      ...l,
      __phase: enableEnter && i < INITIAL_ENTER_CAP ? 'entering' : 'normal',
      __prevIndex: i,
    }))
  );
  const removalTimeouts = useRef<Record<string, number>>({});
  const prevAnimatedRef = useRef<AnimatedVirtualLog[]>([]);
  prevAnimatedRef.current = animatedLogs;

  useEffect(
    () => () => {
      Object.values(removalTimeouts.current).forEach(clearTimeout);
    },
    []
  );

  useEffect(() => {
    const prev = prevAnimatedRef.current;
    const prevMap = new Map(prev.map((l) => [l.id, l]));
    const nextIds = logs.map((l) => l.id);

    const next: AnimatedVirtualLog[] = [];
    let newAddsThisBatch = 0;
    const MAX_NEW_ANIMATIONS_IN_BATCH = 60; // safety cap per update to avoid perf dips
    logs.forEach((log, idx) => {
      const existing = prevMap.get(log.id);
      if (!existing) {
        const shouldAnimateEnter =
          enableEnter &&
          idx < INITIAL_ENTER_CAP &&
          newAddsThisBatch < MAX_NEW_ANIMATIONS_IN_BATCH;
        next.push({
          ...log,
          __phase: shouldAnimateEnter ? 'entering' : 'normal',
          __prevIndex: idx,
        });
        if (shouldAnimateEnter) newAddsThisBatch++;
      } else {
        const resurrected = existing.__phase === 'exiting';
        next.push({
          ...log,
          __phase:
            resurrected && enableEnter
              ? 'entering'
              : existing.__phase === 'entering'
                ? 'entering'
                : 'normal',
          __prevIndex: existing.__prevIndex ?? idx,
        });
      }
    });

    let exitingCount = 0;
    prev.forEach((oldItem, oldIdx) => {
      if (!nextIds.includes(oldItem.id) && oldItem.__phase !== 'exiting') {
        if (exitingCount >= EXIT_CAP) return;
        exitingCount++;
        const exiting: AnimatedVirtualLog = {
          ...oldItem,
          __phase: 'exiting',
          __prevIndex: oldIdx,
        };
        // Insert near previous index so it remains visible during fade
        let insertAt = next.length;
        for (let i = 0; i < next.length; i++) {
          const candidate = next[i];
          if ((candidate.__prevIndex ?? i) > oldIdx) {
            insertAt = i;
            break;
          }
        }
        next.splice(insertAt, 0, exiting);
        removalTimeouts.current[oldItem.id] = window.setTimeout(() => {
          setAnimatedLogs((cur) => cur.filter((c) => c.id !== oldItem.id));
          delete removalTimeouts.current[oldItem.id];
        }, exitDurationMs);
      }
    });

    setAnimatedLogs(next);
    // Clean up any timers whose targets already removed from animated list
    Object.keys(removalTimeouts.current).forEach((id) => {
      if (!next.some((l) => l.id === id)) {
        clearTimeout(removalTimeouts.current[id]);
        delete removalTimeouts.current[id];
      }
    });
  }, [logs, enableEnter, exitDurationMs]);

  const markEntered = useCallback((id: string) => {
    setAnimatedLogs((cur) =>
      cur.map((l) =>
        l.id === id && l.__phase === 'entering'
          ? {
              ...l,
              __phase: 'normal',
            }
          : l
      )
    );
  }, []);

  return { animatedLogs, markEntered, enableLayout };
}
