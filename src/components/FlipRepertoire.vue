<template>
  <div class="repertoire">
    <div
      v-if="isMobile"
      class="mobile-repertoire"
      v-bind:style="mobileRepertoireStyle"
      @touchstart="mobileStart($event)"
      @touchmove="mobileMove($event)"
      @touchend="mobileEnd()"
    >
      <div
        class="mobile-curr-content"
        v-bind:style="mobileCurrContentStyle"
        v-html="pages[page]"
      ></div>
      <div
        class="mobile-next-container-left"
        v-bind:style="mobileNextContainerLeftStyle"
      >
        <div
          class="mobile-next-content-left"
          v-bind:style="mobileNextContentLeftStyle"
        ></div>
      </div>
      <div
        class="mobile-next-container-right"
        v-bind:style="mobileNextContainerRightStyle"
      >
        <div
          class="mobile-next-content-right"
          v-bind:style="mobileNextContentRightStyle"
          v-html="pages[(page + 1) % pages.length]"
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
      busy: false,
      isMobile: false,
      pages: [],
      page: 0,
      height: 0,
      width: 0,
      diagonal: 0,
      nextX: 0,
      nextY: 0,
      nextDegree: 0,
      nextContainer: 0,
      nextMove: false,
      nextContentLeft: "",
      nextContentRight: "",
      nextContainerLeft: "",
      nextContainerRight: "",
    };
  },
  computed: {
    mobileRepertoireStyle() {
      return {
        position: "absolute",
        height: this.height + "px",
        width: this.width + "px",
        top: 0,
        left: 0,
        overflow: "hidden",
        userSelect: "none",
        zIndex: 0,
      };
    },
    mobileCurrContentStyle() {
      return {
        position: "absolute",
        height: 0.9 * this.height + "px",
        width: 0.9 * this.width + "px",
        top: 0.05 * this.height + "px",
        bottom: 0.05 * this.height + "px",
        left: 0.05 * this.width + "px",
        right: 0.05 * this.width + "px",
        overflow: "hidden",
        userSelect: "none",
        zIndex: 1,
      };
    },
    mobileNextContainerLeftStyle() {
      return {
        position: "absolute",
        width: 0.9 * this.diagonal + "px",
        height: 0.9 * this.diagonal + "px",
        top: "auto",
        bottom: 0.05 * this.height + "px",
        left: "auto",
        right: 0.05 * this.width + "px",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${this.nextContainer}px) rotate(${this.nextDegree}deg)`,
        transformOrigin: "100% 100%",
        zIndex: this.nextMove ? 2 : 0,
      };
    },
    mobileNextContentLeftStyle() {
      return {
        position: "absolute",
        width: 0.9 * this.width + "px",
        height: 0.9 * this.height + "px",
        top: "auto",
        bottom: "0%",
        left: "100%",
        right: "auto",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${this.nextX}px) translateY(${this.nextY}px) rotate(${this.nextDegree}deg)`,
        transformOrigin: "0% 100%",
        zIndex: this.nextMove ? 3 : 0,
        backgroundColor: "white",
      };
    },
    mobileNextContainerRightStyle() {
      return {
        position: "absolute",
        width: 0.9 * this.diagonal + "px",
        height: 0.9 * this.diagonal + "px",
        top: "auto",
        bottom: 0.05 * this.height + "px",
        left: 0.95 * this.width + "px",
        right: "auto",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${this.nextContainer}px) rotate(${this.nextDegree}deg)`,
        transformOrigin: "0% 100%",
        zIndex: this.nextMove ? 2 : 0,
      };
    },
    mobileNextContentRightStyle() {
      return {
        position: "absolute",
        width: 0.9 * this.width + "px",
        height: 0.9 * this.height + "px",
        top: "auto",
        bottom: "0%",
        left: "auto",
        right: "100%",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${0 - this.nextX}px) translateY(${
          this.nextY
        }px) rotate(${0 - this.nextDegree}deg`,
        transformOrigin: "100% 100%",
        zIndex: this.nextMove ? 3 : 0,
      };
    },
  },
  created() {
    this.isMobile = true;
    this.fetchData();
  },
  methods: {
    fetchData() {
      const domain = `http://127.0.0.1:5000/repertoire?device=${
        this.isMobile ? "mobile" : "desktop"
      }`;
      fetch(domain)
        .then((response) => response.json())
        .then((data) => this.pages.push(...data));
    },
    nextUpdate(that, x0, y0) {
      let x1 = 0.95 * that.width;
      let y1 = 0.95 * that.height;
      if (x0 === x1) x0 = x1 - 1;
      if (y0 === y1) y0 = y1 - 1;
      let y = ((x0 - x1) / (y1 - y0)) * ((x1 - x0) / 2) + (y0 + y1) / 2;
      let x = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)) / 2;
      let alpha = Math.asin(x / (y1 - y));
      that.nextX = -x;
      that.nextY = -x * Math.tan(alpha);
      that.nextDegree = (alpha / Math.PI) * 180;
      that.nextContainer = (y - y1) * Math.tan(alpha);
    },
    nextStart(that) {
      that.busy = true;
      let alpha = (that.nextDegree * Math.PI) / 180;
      let newNextX = -0.9 * that.width * Math.cos(alpha);
      let newNextY = -0.9 * that.width * Math.sin(alpha);
      let newNextContainer = -0.9 * that.width;
      const leftContainer = [
        {
          transform: `translateX(${that.nextContainer}px) rotate(${that.nextDegree}deg)`,
        },
        {
          transform: `translateX(${newNextContainer}px) rotate(${that.nextDegree}deg)`,
        },
      ];
      const leftContent = [
        {
          transform: `translateX(${that.nextX}px) translateY(${that.nextY}px) rotate(${that.nextDegree}deg)`,
        },
        {
          transform: `translateX(${newNextX}px) translateY(${newNextY}px) rotate(${that.nextDegree}deg)`,
        },
      ];
      const rightContainer = [
        {
          transform: `translateX(${that.nextContainer}px) rotate(${that.nextDegree}deg)`,
        },
        {
          transform: `translateX(${newNextContainer}px) rotate(${that.nextDegree}deg)`,
        },
      ];
      const rightContent = [
        {
          transform: `translateX(${-that.nextX}px) translateY(${
            that.nextY
          }px) rotate(${-that.nextDegree}deg)`,
        },
        {
          transform: `translateX(${-newNextX}px) translateY(${newNextY}px) rotate(${-that.nextDegree}deg)`,
        },
      ];
      const duration = { duration: 1000 };
      that.nextContainerLeft.animate(leftContainer, duration);
      that.nextContentLeft.animate(leftContent, duration);
      that.nextContainerRight.animate(rightContainer, duration);
      that.nextContentRight.animate(rightContent, duration);
    },
    nextEnd(that) {
      that.busy = true;
      let newNextX = -0.9 * that.width;
      let newNextContainer = -0.9 * that.width;
      const leftContainer = [
        {
          transform: `translateX(${newNextContainer}px) rotate(${that.nextDegree}deg)`,
        },
        {
          transform: `translateX(${newNextContainer}px) rotate(0deg)`,
        },
      ];
      const leftContent = [
        {
          transform: `translateX(${newNextX}px) translateY(0px) rotate(${that.nextDegree}deg)`,
          transformOrigin: "100% 100%",
        },
        {
          transform: `translateX(${newNextX}px) translateY(0px) rotate(0deg)`,
          transformOrigin: "100% 100%",
        },
      ];
      const rightContainer = [
        {
          transform: `translateX(${newNextContainer}px) rotate(${that.nextDegree}deg)`,
        },
        {
          transform: `translateX(${newNextContainer}px) rotate(0deg)`,
        },
      ];
      const rightContent = [
        {
          transform: `translateX(${-newNextX}px) translateY(0px) rotate(${-that.nextDegree}deg)`,
          transformOrigin: "0% 100%",
        },
        {
          transform: `translateX(${-newNextX}px) translateY(0px) rotate(0deg)`,
          transformOrigin: "0% 100%",
        },
      ];
      const duration = { duration: 1000, delay: 1000 };
      that.nextContainerLeft.animate(leftContainer, duration);
      that.nextContentLeft.animate(leftContent, duration);
      that.nextContainerRight.animate(rightContainer, duration);
      let lastStep = that.nextContentRight.animate(rightContent, duration);
      lastStep.onfinish = () => {
        that.nextX = 0;
        that.nextY = 0;
        that.nextDegree = 0;
        that.nextContainer = 0;
        that.page = (that.page + 1) % that.pages.length;
        that.nextMove = false;
        that.busy = false;
      };
    },
    mobileStart(event) {
      if (this.busy) return;
      this.nextContainerLeft = document.querySelector(
        ".mobile-next-container-left"
      );
      this.nextContentLeft = document.querySelector(
        ".mobile-next-content-left"
      );
      this.nextContainerRight = document.querySelector(
        ".mobile-next-container-right"
      );
      this.nextContentRight = document.querySelector(
        ".mobile-next-content-right"
      );
      let x = event.touches[0].clientX;
      let y = event.touches[0].clientY;
      if (
        x <= 0.95 * this.width &&
        x >= 0.65 * this.width &&
        y <= 0.95 * this.height &&
        y >= 0.65 * this.height
      ) {
        this.nextMove = true;
        this.nextUpdate(this, x, y);
      }
    },
    mobileMove(event) {
      if (this.busy) return;
      if (this.nextMove) {
        let x = event.touches[0].clientX;
        let y = event.touches[0].clientY;
        // out of window
        if (
          x > 0.95 * this.width ||
          x < 0.05 * this.width ||
          y > 0.95 * this.height ||
          y < 0.05 * this.height
        ) {
          this.nextStart(this);
          this.nextEnd(this);
          return;
        }
        // avoid ripping
        let x0 = 0.95 * this.width;
        let y0 = 0.95 * this.height;
        let tip = ((y0 - y) / (x - x0)) * ((y0 - y) / 2) + (x + x0) / 2;
        if (tip < 0.05 * this.width) {
          this.nextEnd(this);
          return;
        }
        this.nextUpdate(this, x, y);
      }
    },
    mobileEnd() {
      if (this.busy) return;
      this.nextStart(this);
      this.nextEnd(this);
    },
  },
  mounted() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.diagonal = Math.sqrt(
      this.width * this.width + this.height * this.height
    );
  },
};
</script>
