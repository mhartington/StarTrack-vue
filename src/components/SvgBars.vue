<template>
  <svg class="audio-bars" viewBox="0 0 11 11">
    <defs>
      <rect id="bar" x="0" width="2.1" y="0" height="11" rx=".25"></rect>
      <mask id="bar-mark">
        <use href="#bar" fill="white"></use>
      </mask>
    </defs>
    <g mask="url(#bar-mark)">
      <use class="animated-bar bar-1" href="#bar"></use>
    </g>
    <g mask="url(#bar-mark)" transform="translate(2.9668 0)">
      <use class="animated-bar bar-2" href="#bar"></use>
    </g>
    <g mask="url(#bar-mark)" transform="translate(5.9333 0)">
      <use class="animated-bar bar-3" href="#bar"></use>
    </g>
    <g mask="url(#bar-mark)" transform="translate(8.8999 0)">
      <use class="animated-bar bar-4" href="#bar"></use>
    </g>
  </svg>
</template>

<style scoped>
.animated-bar {
  --primaryColor: #000;
  transform: translateY(9px);
  animation-name: none;
  animation-duration: 0.4s;
  animation-delay: var(--delay, 0);
  animation-direction: alternate;
  animation-timing-function: ease-in;
  animation-iteration-count: infinite;
  fill: var(--ion-color-step-250);
}
.animated-bar.bar-1 {
  --max-height-offset: 6px;
  --delay: 250ms;
  animation-duration: 0.6s;
}
.animated-bar.bar-2 {
  --max-height-offset: 2px;
  --delay: 615ms;
}
.animated-bar.bar-3 {
  --max-height-offset: 4px;
  --delay: 475ms;
}
.animated-bar.bar-4 {
  --max-height-offset: 2px;
  --delay: 25ms;
}

.playing .animated-bar {
  animation-name: playback-bar;
}

@keyframes playback-bar {
  to {
    transform: translateY(var(--max-height-offset, 0));
  }
}
</style>
