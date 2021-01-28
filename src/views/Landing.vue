<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Star Track</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding ion-text-center">
      <h3>
        Welcome to Star Track <ion-icon :ios="musicalNotes" color="primary" />
      </h3>
      <p>Star Track is a simple way to interact with Apple Music.</p>
      <ion-button routerLink="/browse">Get Started</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { musicalNotes } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonPage,
  IonIcon,
} from '@ionic/vue';
export default defineComponent({
  name: 'Landing',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonPage,
    IonIcon,
  },
  setup() {
    return { musicalNotes };
  },
});
</script>
