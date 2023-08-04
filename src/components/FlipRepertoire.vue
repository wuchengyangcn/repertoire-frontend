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
  computed: {
    mobileRepertoireStyle() {
      return {
        position: "absolute",
        width: this.width + "px",
        height: this.height + "px",
        overflow: "hidden",
        userSelect: "none",
      };
    },
    mobileCurrContentStyle() {
      return {
        position: "absolute",
        width: this.width + "px",
        height: this.height + "px",
        overflow: "hidden",
        userSelect: "none",
        zIndex: 1,
      };
    },
    mobileNextLeftContainerStyle() {
      return {
        position: "absolute",
        width: 0.9 * this.width + "px",
        height: 0.9 * this.height + "px",
        overflow: "hidden",
        userSelect: "none",
        top: "auto",
        bottom: this.height * 0.05 + "px",
        left: "auto",
        right: this.width * 0.05 + "px",
        transform: `translateX(${this.nextContainer}px) rotate(${this.nextDegree}deg)`,
        transformOrigin: "100% 100%",
        zIndex: this.nextMove ? 2 : 0,
      };
    },
    mobileNextLeftContentStyle() {
      return {
        position: "absolute",
        width: this.width + "px",
        height: this.height + "px",
        overflow: "hidden",
        userSelect: "none",
        top: "auto",
        bottom: "0%",
        left: "100%",
        right: "auto",
        transform: `translateX(${this.nextX}px) translateY(${this.nextY}px) rotate(${this.nextDegree}deg)`,
        transformOrigin: "0% 100%",
        zIndex: this.nextMove ? 3 : 0,
        backgroundColor: "white",
      };
    },
    mobileNextRightContainerStyle() {
      return {
        position: "absolute",
        width: 0.9 * this.diagonal + "px",
        height: 0.9 * this.diagonal + "px",
        overflow: "hidden",
        userSelect: "none",
        top: "auto",
        bottom: this.height * 0.05 + "px",
        left: this.width * 0.95 + "px",
        right: "auto",
        transform: `translateX(${this.nextContainer}px) rotate(${this.nextDegree}deg)`,
        transformOrigin: "0% 100%",
        zIndex: this.nextMove ? 2 : 0,
      };
    },
    mobileNextRightContentStyle() {
      return {
        position: "absolute",
        width: this.width + "px",
        height: this.height + "px",
        overflow: "hidden",
        userSelect: "none",
        top: "auto",
        bottom: "0%",
        left: "auto",
        right: "100%",
        transform: `translateX(${0 - this.nextX}px) translateY(${
          this.nextY
        }px) rotate(${0 - this.nextDegree}deg)`,
        transformOrigin: "100% 100%",
        zIndex: this.nextMove ? 3 : 0,
      };
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      const domain = `http://127.0.0.1:5000/repertoire?device=${
        this.isMobile ? "mobile" : "desktop"
      }`;
      fetch(domain)
        .then((response) => response.json())
        .then((data) => this.htmlCode.push(...data));
    },
    touchStartHandler(event) {
      this.nextLeftContainer = document.querySelector(
        ".mobile-next-left-container"
      );
      this.nextLeftContent = document.querySelector(
        ".mobile-next-left-content"
      );
      this.nextRightContainer = document.querySelector(
        ".mobile-next-right-container"
      );
      this.nextRightContent = document.querySelector(
        ".mobile-next-right-content"
      );

      let minX = this.width * 0.65;
      let maxX = this.width * 0.95;
      let minY = this.height * 0.65;
      let maxY = this.height * 0.95;
      let touchX = event.touches[0].clientX;
      let touchY = event.touches[0].clientY;
      if (
        minX <= touchX &&
        touchX <= maxX &&
        minY <= touchY &&
        touchY <= maxY
      ) {
        this.nextMove = true;
        this.nextUpdate(this, touchX, touchY);
      }
    },
    touchMoveHandler(event) {
      if (this.nextMove) {
        let touchX = event.touches[0].clientX;
        let touchY = event.touches[0].clientY;
        this.nextUpdate(this, touchX, touchY);
      }
    },
    touchEndHandler(event) {
      if (this.nextMove) {
        let touchX = event.changedTouches[0].clientX;
        let touchY = event.changedTouches[0].clientY;
        this.nextUpdate(this, touchX, touchY);
      }
    },
  },
  mounted() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.diagonal = Math.sqrt(
      this.width * this.width + this.height * this.height
    );
    this.isMobile = true;
  },
};
</script>
