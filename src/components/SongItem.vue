<template>
  <ion-item button="true">
    <slot></slot>
    <ion-text color="primary" slot="start" v-if="index != null">
      <p class="index">{{ index + 1 }}</p>
    </ion-text>
    <template v-if="song">
      <ion-label>
        <h3>{{ song.attributes.name }}</h3>
        <ion-note v-if="song.attributes.artistName">
          <p>{{ song.attributes.artistName }}</p>
        </ion-note>
      </ion-label>
      <p
        slot="end"
        class="rating"
        v-if="song.attributes.contentRating === 'explicit'"
      >
        E
      </p>
      <ion-note slot="end" v-if="song.attributes.durationInMillis">{{
        useMsToMins(song.attributes.durationInMillis)
      }}</ion-note>
    </template>
    <template v-else>
      <ion-label>
        <ion-skeleton-text :animated="true" style="width: 88%" />
        <ion-skeleton-text :animated="true" style="width: 70%" />
      </ion-label>
    </template>
  </ion-item>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { useMsToMins } from '../hooks';
import { IonItem, IonNote, IonText, IonLabel, IonSkeletonText } from '@ionic/vue';
export default defineComponent({
  name: 'SongItem',
  components: { IonItem, IonNote, IonText, IonLabel,  IonSkeletonText },
  props: {
    song: Object,
    index: Number,
  },
  setup() {
    return { useMsToMins };
  },
});
</script>
<style scoped>
ion-thumbnail {
  margin-inline-end: 15px;
}
ion-label h3,
ion-label ion-note * {
  overflow: hidden;
  text-overflow: ellipsis;
}
.index {
  font-variant-numeric: tabular-nums;
  text-align: right;
}
ion-note {
  font-variant-numeric: tabular-nums;
}
.rating {
  background: #aaa;
  color: #fff;
  width: 12px;
  text-align: center;
  height: 12px;
  font-weight: 300;
  border-radius: 3px;
  font-size: 9px;
}
ion-item.active ion-item {
  --background: var(--ion-color-step-100);
}
</style>
