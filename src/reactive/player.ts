import { reactive, toRefs } from "vue";

export enum PlaybackStates {
  NONE,
  LOADING,
  PLAYING,
  PAUSED,
  STOPPED,
  ENDED,
  SEEKING,
  NULL,
  WAITING,
  STALLED,
  COMPLETED,
}
interface NowPlaying {
  albumName: string;
  artistName: string;
  artworkURL: string;
  title: string;
  trackNumber: number;
  id: string;
  type: string;
  container: {
    id: string;
  };
  collectionId: string;
  assets: {
    metadata: {
      artistId: string;
      playlistId: string;
    };
  }[];
}
interface PlayerState {
  bitrate: number;
  playbackState: PlaybackStates;
  queue: any[];
  queuePosition: number;
  repeatMode: number;
  isShuffling: boolean;
  infiniteLoadTimeout: any;
  playbackDuration: number;
  playbackTime: number;
  nowPlayingItem: NowPlaying;
}


let mkInstance: any;
let mkEvents: any;
let mkPlayerInst: any;

globalThis?.document.addEventListener('musickitloaded', () => {
  mkInstance = (window as any).MusicKit.getInstance();
  mkEvents = (window as any).MusicKit.Events;
  mkPlayerInst = mkInstance.player;

  mkInstance.addEventListener(mkEvents.playbackTimeDidChange, playbackTimeDidChange);
  mkInstance.addEventListener(mkEvents.playbackDurationDidChange, playbackDurationDidChange);
  mkInstance.addEventListener(mkEvents.mediaPlaybackError, mediaPlaybackError);
  mkInstance.addEventListener(mkEvents.playbackStateDidChange, playbackStateDidChange);
  mkInstance.addEventListener(mkEvents.mediaItemDidChange, mediaItemDidChange);
  mkInstance.addEventListener(mkEvents.queueItemsDidChange, queueItemsDidChange);
  mkInstance.addEventListener(mkEvents.queuePositionDidChange, queuePositionDidChange);

})

const internalState = reactive<PlayerState>({
  bitrate: 256,
  playbackState: PlaybackStates.NONE,
  queue: [],
  queuePosition: 0,
  repeatMode: 0,
  isShuffling: false,
  infiniteLoadTimeout: null,
  playbackDuration: 0,
  playbackTime: 0,
  nowPlayingItem: {
    albumName: "",
    artistName: "",
    artworkURL: "/assets/imgs/default.jpeg",
    title: "",
    trackNumber: 1,
    id: "",
    type: "",
    container: { id: "" },
    collectionId: "",
    assets: [
      {
        metadata: {
          artistId: "",
          playlistId: "",
        },
      },
    ],
  },
});
export const playerState = toRefs(internalState);
function playbackTimeDidChange(event: any) {
  internalState.playbackTime = event.currentPlaybackTime;
}
function playbackDurationDidChange(event: any) {
  internalState.playbackDuration = event.duration;
}
function mediaItemDidChange(event: any) {
  internalState.nowPlayingItem = event.item;
  internalState.playbackTime = 0;

  // this.select('nowPlayingItem').pipe(
  //   tap((nowPlaying) =>
  //     this.title.setTitle(`${nowPlaying.title} • ${nowPlaying.artistName}`)
  //   )
  // );
}
function playbackStateDidChange({state}) {
  internalState.playbackState = PlaybackStates[PlaybackStates[state]];
  // const currentState = this.get();
  //
  // if (currentState.playbackState === PlaybackStates.WAITING) {
  //   const lastItem = currentState.nowPlayingItem;
  //   currentState.infiniteLoadTimeout = setTimeout(async () => {
  //     if (
  //       currentState.playbackState === PlaybackStates.WAITING &&
  //       lastItem === currentState.nowPlayingItem
  //     ) {
  //       await this.stop();
  //       await this.play();
  //     }
  //   }, 2000);
  // } else {
  //   clearTimeout(currentState.infiniteLoadTimeout);
  // }
  // if (
  //   currentState.playbackState === PlaybackStates.PAUSED ||
  //   currentState.playbackState === PlaybackStates.STOPPED
  // ) {
  //   this.title.setTitle('Star Track');
  // } else {
  //   this.title.setTitle(
  //     `${currentState.nowPlayingItem.title} • ${currentState.nowPlayingItem.artistName}`
  //   );
  // }
}
//event: any
function mediaPlaybackError(): void {
  throw new Error('mediaPlayBackError');
}
function queueItemsDidChange(e: any): void {
  internalState.queue = e;
}
function queuePositionDidChange(event: any): void {
  internalState.queuePosition = event.position + 1;
}

export async function setQueueFromItems( items: any, startPosition = 0, shuffle = false) {
  if (shuffle) {
    items = items.sort(() => 0.5 - Math.random());
  }
  const newItems = items.map((item) => ({
    ...item,
    container: { id: item.id },
  }));
  await mkInstance.setQueue({ items: newItems });
  await mkInstance.changeToMediaAtIndex(startPosition);
}
export async function play() {
  await mkPlayerInst.play();
}
export async function pause() {
  await mkPlayerInst.pause();
}
export async function stop() {
  await mkPlayerInst.stop();
}
export function toggleRepeat(): void {
  const nextRepeatMode = (mkPlayerInst.repeatMode + 1) % 3;
  mkPlayerInst.repeatMode = nextRepeatMode;
  internalState.repeatMode = mkPlayerInst.repeastMode;
}
export function toggleShuffle(shouldShuffle: boolean): void {
  mkPlayerInst.shuffleMode = !!shouldShuffle;
  internalState.isShuffling = mkPlayerInst.shuffleMode;
}
export async function seekToTime(time: number) {
  await mkPlayerInst.seekToTime(time);
}
export async function skipToNextItem() {
  if (internalState.repeatMode === 1) {
    return seekToTime(0);
  }
  await mkPlayerInst.skipToNextItem();
}
export async function skipToPreviousItem() {
  if (internalState.repeatMode === 1) {
    return seekToTime(0);
  }
  await mkPlayerInst.skipToPreviousItem();
}
export async function skipTo(index: number) {
  await mkPlayerInst.changeToMediaAtIndex(index);
}


