<template>
  <div
    class="album-header"
    :style="{
      backgroundImage:
        'url(' +
        (collection ? useFormatArtwork(collection.attributes.artwork.url, 1000) : '' ) +
        ')',
    }"
  >
    <div
      class="artwork-header"
      :style="{
        backgroundColor: '#' + collection?.attributes.artwork.bgColor + 'aa',
      }"
    >
      <div class="album-info">
        <img
          class="header-artwork"
          :src="useFormatArtwork(collection?.attributes.artwork.url, 250)"
          alt="artwork for the current collection"
          loading="lazy"
        />
        <div
          class="album-detail"
          :style="{ color: '#' + collection?.attributes.artwork.textColor1 }"
        >
            <template v-if="collection">
              <h3>{{ collection.attributes.name }}</h3>
              <p class="name">
                <ion-text color="primary">
                  {{ collection.attributes.artistName ? collection.attributes.artistName : collection.attributes.curatorName }}
                </ion-text>
              </p>
              <p class="description">
                {{ collection.attributes.description ? collection.attributes.description.short : collection.attributes.genreNames[0] }}
              </p>
              <p class="duration">
                {{ collection.relationships.tracks.data.length }} Songs,
                {{ useTimeFormat(duration) }}
              </p>
            </template>

          <template v-if="!collection">
            <h3><ion-skeleton-text :animated="true" style="width: 80%" /></h3>
            <p><ion-skeleton-text :animated="true" style="width: 70%" /></p>
            <p><ion-skeleton-text :animated="true" style="width: 60%" /></p>
            <p><ion-skeleton-text :animated="true" style="width: 60%" /></p>
          </template>

          <ion-button
            @click="$emit('playCollection', false)"
            color="light"
            fill="solid"
          >
            <ion-icon color="primary" slot="start" :icon="play" />
            <ion-text color="primary">Play</ion-text>
          </ion-button>
          <ion-button
            @click="$emit('playCollection', true)"
            color="light"
            fill="solid"
          >
            <ion-icon color="primary" :icon="shuffle" slot="start" />
            <ion-text color="primary">Shuffle</ion-text>
          </ion-button>
          <ion-button color="light" fill="solid">
            <ion-icon
              color="primary"
              :icon="ellipsisVertical"
              slot="icon-only"
            />
          </ion-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { IonButton, IonIcon, IonText, IonSkeletonText } from '@ionic/vue';
import { ellipsisVertical, shuffle, play } from 'ionicons/icons';
import { defineComponent, ref, watch } from 'vue';
import { useFormatArtwork, useTimeFormat } from '../composables';
export default defineComponent({
  name: 'AlbumHeader',
  components: { IonSkeletonText, IonButton, IonIcon, IonText },
  props: { collection: Object },
  emits: ['playCollection'],
  setup(props) {
    const duration = ref<number>(0);
    const backgroundHeader = ref<string>('');
    watch(
      () => props.collection,
      (collection: any) => {
        backgroundHeader.value = useFormatArtwork(
          collection.attributes.artwork.url,
          1000
        );
        if (collection.relationships.tracks.data) {
          let internalDuration = 0;
          for (const song of collection.relationships.tracks.data) {
            if (song.attributes.durationInMillis) {
              internalDuration += song.attributes.durationInMillis;
            }
          }
          duration.value = internalDuration;
        }
      }
    );

    return {
      useFormatArtwork,
      duration,
      useTimeFormat,
      ellipsisVertical,
      shuffle,
      play,
      backgroundHeader,
    };
  },
});
</script>
<style scoped>
.album-header {
  background-repeat: no-repeat no-repeat;
  background-size: cover;
  background-position: center center;
  overflow: hidden;
}
.artwork-header {
  display: flex;
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  overflow: hidden;
  height: 300px;
  align-items: center;
  justify-content: flex-start;
}
.artwork-bg {
  position: absolute;
  width: 100%;
  height: 300px;
  z-index: 0;
  opacity: 0.8;
  filter: brightness(25%);
}
.album-info {
  display: flex;
  align-items: center;
  padding-left: var(--ion-safe-area-left);
  z-index: 1;
  overflow: hidden;
}
.header-artwork {
  border-radius: 4px;
  display: block;
  height: 200px;
  width: 200px;
  min-width: 200px;
  margin: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}
.album-detail {
  padding: 0 16px;
  z-index: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.album-detail h3,
.album-detail p {
  overflow: hidden;
  text-overflow: ellipsis;
}
.album-detail h3 {
  font-weight: 800;
}
.album-detail .name {
  font-weight: bold;
}
@media (max-width: 650px) {
  .header-artwork {
    display: none;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
