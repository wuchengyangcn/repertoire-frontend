<template>
  <div class="repertoire">
    <div
      v_if="isMobile"
      class="mobile-repertoire"
      v-bind:style="mobileRepertoireStyle"
      @touchstart="touchStartHandler($event)"
      @touchmove="touchMoveHandler($event)"
      @touchend="touchEndHandler($event)"
    >
      <div
        class="mobile-curr-content"
        v-bind:style="mobileCurrContentStyle"
        v-html="this.html_code[this.index]"
      ></div>
      <div
        class="mobile-next-left-container"
        v-bind:style="mobileNextLeftContainerStyle"
      >
        <div
          class="mobile-next-left-content"
          v-bind:style="mobileNextLeftContentStyle"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "Repertoire",
      isMobile: true,
      htmlCode: [],
      index: 0,
      width: 0,
      height: 0,
      diagonal: 0,
      nextMove: false,
      nextContainer: 0,
      nextDegree: 0,
      nextX: 0,
      nextY: 0,
      nextLeftContainer: "",
      nextRightContainer: "",
      nextLeftContent: "",
      nextRightContent: "",
    };
  },
};
</script>
