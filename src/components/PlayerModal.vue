<template>
  <ion-header @click="dismiss()" class="ion-no-border">
    <div class="dismisser"></div>
  </ion-header>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { IonHeader, modalController } from "@ionic/vue";
export default defineComponent({
  components: { IonHeader },
  setup() {
    console.log("here");
    const dismiss = async () => modalController.dismiss();
    return { dismiss };
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
  height: 100%;
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
.track-wrapper .track-player .song-info ion-label * {
  font-size: 2em;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.track-wrapper .track-player .song-info ion-thumbnail {
  width: 100%;
  padding-top: 100%;
  position: relative;
  margin: auto;
}
.track-wrapper .track-player .song-info ion-thumbnail lazy-img {
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
