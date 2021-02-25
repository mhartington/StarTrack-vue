<template>
  <ion-footer class="mh-footer" translucent="true" @click="openPlayerModal()">
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
  </ion-footer>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import {
  IonRange,
  IonIcon,
  IonButton,
  IonFooter,
  IonNote,
  IonThumbnail,
  IonLabel,
  IonButtons,
  IonSpinner,
  modalController,
} from "@ionic/vue";
import { playBack, play, pause, playForward } from "ionicons/icons";
import PlayerModal from "./PlayerModal.vue";
import {
  playerState as state,
  PlaybackStates,
  play as mkPlay,
  pause as mkPause,
  skipToNextItem,
  skipToPreviousItem,
  seekToTime,
} from "../reactive/player";

export default defineComponent({
  name: "TrackPlayer",
  components: {
    IonNote,
    IonThumbnail,
    IonRange,
    IonButton,
    IonIcon,
    IonFooter,
    IonLabel,
    IonButtons,
    IonSpinner,
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

    const openPlayerModal = async () => {
      const modal = await modalController.create({
        component: PlayerModal,
        swipeToClose: false,
        cssClass: "full-modal",
      });
      await modal.present();
    };
    return {
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
      openPlayerModal,
      ...state,
    };
  },
});
</script>
<style scoped>
.mh-footer {
  position: absolute;
  bottom: 0;
}

.mh-footer .footer-background {
  z-index: -1 !important;
}

.mh-footer .track-player {
  background-color: rgba(
    var(--ion-background-color-rgb),
    var(--platform-opacity)
  );
  border-top-width: 0.55px;
  border-top-style: solid;
  border-top-color: rgba(var(--ion-background-color-rgb), 0.2);
  min-height: calc(var(--ion-safe-area-bottom) + 58px);
  padding: 4px calc(16px + var(--ion-safe-area-left));
  color: #444;
  padding-bottom: var(--ion-safe-area-bottom);
  justify-content: space-between;
  display: grid;
  grid-template-columns: minmax(200px, 30%) minmax(auto, 400px) minmax(
      90px,
      30%
    );
  grid-gap: 10px;
  width: 100%;
}

.mh-footer .song-info {
  display: grid;
  grid-template-columns: 48px auto;
  overflow: hidden;
}

.mh-footer .song-info ion-label {
  padding-left: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.mh-footer .song-info ion-label * {
  overflow: hidden;
  white-space: nowrap;
}

.mh-footer ion-range {
  padding-top: 0;
  padding-bottom: 0;
}

.mh-footer .song-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

@media (max-width: 849px) {
  .mh-footer .track-player {
    grid-template-columns: minmax(200px, 30%) minmax(auto, 300px) minmax(
        90px,
        auto
      );
  }
}

@media (max-width: 645px) {
  .mh-footer .track-player {
    grid-template-columns: 50% 50%;
  }

  .mh-footer ion-range {
    display: none;
  }
}
</style>
