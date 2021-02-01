<template>
  <div class="album-item">
    <ion-card>
      <img
        :src="useFormatArtwork(collection?.attributes.artwork.url, 200)"
        alt="album artwork"
        loading="lazy"
      />
    </ion-card>

    <ion-label>
      <template v-if="collection">
        <h3>
          <span class="index">{{ index + 1 }}</span>
          {{ collection.attributes.name }}
          <span
            class="rating"
            v-if="collection.attributes.contentRating === 'explicit'"
            >E</span
          >
        </h3>
        <ion-note>
          <p>{{ collection.attributes.artistName }}</p>
        </ion-note>
      </template>
      <template v-else>
        <h3><ion-skeleton-text :animated="true" style="width: 88%" /></h3>
        <p><ion-skeleton-text :animated="true" style="width: 70%" /></p>
      </template>
    </ion-label>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useFormatArtwork } from '../hooks';
import { IonCard, IonLabel, IonNote, IonSkeletonText } from '@ionic/vue';
export default defineComponent({
  name: 'AlbumItem',
  components: { IonCard, IonLabel, IonNote, IonSkeletonText },
  props: {
    collection: Object,
    index: Number,
  },
  setup() {
    return { useFormatArtwork };
  },
});
</script>
<style scoped>
.album-item {
  margin: auto;
  max-width: 170px;
  padding: 5px;
}
ion-card {
  padding: 0;
  margin: 0;
  width: 160px;
  height: 160px;
  display: block;
  margin: auto;
}
ion-card:hover {
  cursor: pointer;
}
ion-card:focus {
  outline: none;
}

img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

ion-label {
  margin: 8px 0 16px;
  display: block;
  white-space: nowrap;
}
ion-label * {
  overflow: hidden;
  text-overflow: ellipsis;
}

.index {
  font-weight: 800;
}

.rating {
  background: #aaa;
  color: #fff;
  width: 12px;
  display: inline-block;
  text-align: center;
  height: 12px;
  font-weight: 300;
  border-radius: 3px;
  font-size: 9px;
  margin-left: 5px;
  margin-top: -2px;
  vertical-align: middle;
}
</style>
