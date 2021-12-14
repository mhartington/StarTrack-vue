import { watch, WatchOptions } from 'vue';

const isFunction = (f: any) => typeof f === 'function';

export function useFormatArtwork(url: string, dim: number) {
  if (!url) {
    return '/assets/imgs/default.jpeg';
  }
  return url.replace(/\{w\}|\{h\}/g, dim.toString());
}

export function useMsToMins(dur: number) {
  const pad2 = (num: any) => {
    if (num <= 99) {
      num = ('0' + num).slice(-2);
    }
    return num;
  };
  const durationFromMsHelper = (ms: number) => {
    let x: number = ms / 1000;
    const seconds: number = pad2(Math.floor(x % 60));
    x /= 60;
    const minutes: number = pad2(Math.floor(x % 60));
    x /= 60;
    const hours: number = Math.floor(x % 24);
    const newHours = hours ? pad2(hours) + ':' : '';
    return newHours + minutes + ':' + seconds;
  };
  return durationFromMsHelper(dur);
}

export function useTimeFormat(dur: number) {
  const { hours, minutes } = (window as any).MusicKit.formattedMilliseconds(
    dur
  );
  const hourTime = hours === 0 ? `` : `${hours} hours, `;
  const minutesTime = `${minutes} minutes`;
  return `${hourTime} ${minutesTime} `;
}

export function useEffect(effectHandler: any, dependencies: any[]) {
  return watch(
    dependencies,
    (changedDependencies, prevDependencies, onCleanUp) => {
      const effectCleaner = effectHandler(
        changedDependencies,
        prevDependencies
      );
      if (isFunction(effectCleaner)) {
        onCleanUp(effectCleaner);
      }
    },
    { immediate: true, deep: true } as WatchOptions
  );
}

export function debounce(fn: any, ms = 300) {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
}
