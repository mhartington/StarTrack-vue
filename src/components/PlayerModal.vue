<template>
  <ion-header @click="dismiss()" class="ion-no-border">
    <div class="dismisser"></div>
  </ion-header>
  <div class="track-wrapper">
    <div class="track-player">
      <div class="song-info">
        <ion-thumbnail>
          <img
            :src="nowPlayingItem.artworkURL"
            alt="The album art work cover"
          />
        </ion-thumbnail>

        <ion-label>
          <p>{{ nowPlayingItem.title }}</p>
          <ion-note>{{ nowPlayingItem.artistName }}</ion-note>
        </ion-label>
      </div>

      <ion-range
        :step="1"
        :min="0"
        v-model="playerVal"
        :max="playbackDuration"
        @click="stopProp($event)"
        @pointerdown="onPointerDown($event)"
        @pointerup="onPointerUp($event)"
        :disabled="
          playbackDuration === 0 ||
          playbackState === playerStateEnum.NONE ||
          playbackState === playerStateEnum.LOADING ||
          playbackState === playerStateEnum.ENDED ||
          playbackState === playerStateEnum.WAITING ||
          playbackState === playerStateEnum.STALLED
        "
      ></ion-range>
      <ion-buttons class="song-actions">
        <ion-button
          shape="round"
          color="primary"
          fill="clear"
          class="prev-button"
          @click="prev($event)"
        >
          <ion-icon :icon="playBack" slot="icon-only"></ion-icon>
        </ion-button>
        <ion-button
          shape="round"
          color="primary"
          fill="clear"
          @click="togglePlay($event)"
        >
          <ion-spinner
            v-if="
              playbackState === playerStateEnum.LOADING ||
              playbackState === playerStateEnum.ENDED ||
              playbackState === playerStateEnum.WAITING ||
              playbackState === playerStateEnum.STALLED
            "
          >
          </ion-spinner>
          <ion-icon
            v-else
            :icon="playbackState === playerStateEnum.PLAYING ? pause : play"
            slot="icon-only"
          ></ion-icon>
        </ion-button>
        <ion-button
          shape="round"
          color="primary"
          fill="clear"
          @click="next($event)"
        >
          <ion-icon :icon="playForward" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-buttons>
    </div>

    <div class="player-queue">
      <div v-if="queue.length" class="ion-padding queue-scroller">
        <h1>Player Queue</h1>
        <song-item
          v-for="(song, idx) of queue"
          @click="playAtIndex($event, idx)"
          :key="song.id"
          :song="song"
          :index="idx"
        >
          <ion-thumbnail slot="start">
            <img
              :src="useFormatArtwork(song.attributes.artwork.url, 60)"
              alt="Artwork for Track"
              loading="lazy"
            />
          </ion-thumbnail>
          <div v-if="queuePosition === idx + 1" class="svg-aside" slot="end">
            <svg-bars
              :class="{ playing: playbackState === playerStateEnum.PLAYING }"
            ></svg-bars>
          </div>
        </song-item>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, watch, ref } from 'vue';
import {
  IonHeader,
  modalController,
  IonRange,
  IonIcon,
  IonButton,
  IonNote,
  IonThumbnail,
  IonLabel,
  IonButtons,
  IonSpinner,
} from '@ionic/vue';

import { useFormatArtwork } from '../composables';
import SongItem from '../components/SongItem.vue';
import SvgBars from '../components/SvgBars.vue';
import {
  playerState as state,
  PlaybackStates,
  play as mkPlay,
  pause as mkPause,
  skipToNextItem,
  skipToPreviousItem,
  seekToTime,
  skipTo,
} from '../reactive/player';
import { playBack, play, pause, playForward } from 'ionicons/icons';

export default defineComponent({
  components: {
    IonHeader,
    IonRange,
    IonIcon,
    IonButton,
    IonNote,
    IonThumbnail,
    IonLabel,
    IonButtons,
    IonSpinner,
    SongItem,
    SvgBars,
  },
  setup() {
    const playerStateEnum = PlaybackStates;
    let isScrubbing = false;

    const playerVal = ref(0);
    const stopProp = (event: Event) => {
      event.stopPropagation();
    };
    const onPointerUp = async (event: any) => {
      stopProp(event);
      await seekToTime(event.target.value);
      isScrubbing = false;
    };
    const onPointerDown = (event: any) => {
      stopProp(event);
      isScrubbing = true;
      playerVal.value = event.target.value;
    };
    watch(state.playbackTime, (newVal) => {
      if (!isScrubbing) {
        playerVal.value = newVal;
      }
    });
    const next = async (event: any) => {
      stopProp(event);
      await skipToNextItem();
    };
    const prev = async (event: any) => {
      stopProp(event);
      await skipToPreviousItem();
    };
    const togglePlay = async (event: any) => {
      stopProp(event);
      if (state.playbackState.value === playerStateEnum.PAUSED) {
        await mkPlay();
      } else {
        await mkPause();
      }
    };

    const playAtIndex = (e: any, i: number) => {
      stopProp(e);
      skipTo(i);
    };
    const dismiss = async () => modalController.dismiss();
    return {
      playAtIndex,
      stopProp,
      playBack,
      play,
      pause,
      playForward,
      prev,
      next,
      togglePlay,
      playerStateEnum,
      onPointerDown,
      onPointerUp,
      playerVal,
      dismiss,
      useFormatArtwork,
      ...state,
    };
  },
});
</script>
<style scoped>
ion-header {
  padding-top: calc(16px + var(--ion-safe-area-top));
}
ion-header:hover {
  cursor: pointer;
}
ion-header .dismisser {
  margin: calc(16px + var(--ion-safe-area-top)) auto 16px auto;
  border-radius: 8px;
  height: 9px;
  width: 64px;
  background: var(--ion-color-step-100);
}

.track-wrapper {
  padding-bottom: calc(16px + var(--ion-safe-area-bottom));
  display: block;
  height: 100%;
  overflow: scroll;
}
.track-wrapper .track-player {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: calc(100% - 100px);
}
.track-wrapper .track-player .song-actions {
  flex: initial;
  justify-content: center;
  height: 56px;
}
.track-wrapper .track-player .song-actions ion-button {
  height: 56px;
  width: 56px;
}
.track-wrapper .track-player .song-actions ion-button ion-icon {
  width: 56px;
  height: 56px;
}
.track-wrapper .track-player ion-range {
  display: block !important;
  width: 80%;
  margin: 0 auto;
  flex: initial;
}
.track-wrapper .track-player .song-info {
  overflow: visible;
  display: block;
  width: 100%;
  padding: 16px;
}
.track-wrapper .track-player .song-info ion-label {

  display: block;
  padding-top: 16px;
}
.track-wrapper .track-player .song-info ion-label * {
  font-size: 2em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-top: 16px;
}
.track-wrapper .track-player .song-info ion-thumbnail {
  width: 100%;
  padding-top: 100%;
  position: relative;
  margin: auto;
}
.track-wrapper .track-player .song-info ion-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 15px;
  overflow: hidden;
}

.track-wrapper .player-queue {
  max-width: 100%;
  display: block;
}
.track-wrapper .player-queue .svg-aside {
  width: 20px;
  height: 20px;
}
@media (min-width: 750px) {
  .track-wrapper {
    display: flex;
    padding-top: 0;
    padding-bottom: 0;
    overflow: hidden;
  }
  .track-wrapper .player-queue {
    padding-top: var(--ion-safe-area-top);
    padding-bottom: var(--ion-safe-area-bottom);
    width: 50%;
  }
  .track-wrapper .player-queue .queue-scroller {
    height: 100%;
    overflow: scroll;
  }
  .track-wrapper .track-player {
    width: 45%;
    max-width: 600px;
    margin: auto;
  }
  .track-wrapper .track-player .song-info {
    width: 100%;
    margin: 0 auto;
  }

  .track-wrapper .track-player ion-range {
    padding: 0;
  }
}
</style>
