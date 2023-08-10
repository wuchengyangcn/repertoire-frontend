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
        class="mobileNextContainerLeft"
        v-bind:style="mobileNextContainerLeftStyle"
      >
        <div
          class="mobileNextContentLeft"
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
      pages: [],
      page: 0,
      height: 0,
      width: 0,
      diagonal: 0,
      isMobile: true,
      busy: false,
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
      var w = this.isMobile ? this.width * 0.9 : this.width * 0.45;
      var h = this.height * 0.9;
      var boxL = Math.sqrt(w * w + h * h);
      return {
        position: "absolute",
        width: boxL + "px",
        height: boxL + "px",
        top: "auto",
        bottom: this.height * 0.05 + "px",
        right: this.width * 0.05 + "px",
        left: "auto",
        transform:
          "translateX(" +
          this.nextContainer +
          "px) rotate(" +
          this.nextDegree +
          "deg)",
        transformOrigin: "100% 100%",
        overflow: "hidden",
        userSelect: "none",
        zIndex: this.nextMove ? 2 : 0,
      };
    },
    mobileNextContainerRightStyle() {
      var w = this.isMobile ? this.width * 0.9 : this.width * 0.45;
      var h = this.height * 0.9;
      var boxL = Math.sqrt(w * w + h * h);
      return {
        position: "absolute",
        width: boxL + "px",
        height: boxL + "px",
        top: "auto",
        bottom: this.height * 0.05 + "px",
        left: this.width * 0.95 + "px",
        right: "auto",
        transform:
          "translateX(" +
          this.nextContainer +
          "px) rotate(" +
          this.nextDegree +
          "deg)",
        transformOrigin: "0% 100%",
        overflow: "hidden",
        userSelect: "none",
        zIndex: this.nextMove ? 2 : 0,
      };
    },
    mobileNextContentLeftStyle() {
      var w = this.isMobile ? this.width * 0.9 : this.width * 0.45;
      var h = this.height * 0.9;
      // var boxL = Math.sqrt(w * w + h * h)
      return {
        position: "absolute",
        width: w + "px",
        height: h + "px",
        top: "auto",
        bottom: "0%",
        left: "100%",
        right: "auto",
        transform:
          "translate(" +
          this.nextX +
          "px, " +
          this.nextY +
          "px) rotate(" +
          this.nextDegree +
          "deg)",
        transformOrigin: "0% 100%",
        backgroundColor: "white",
        overflow: "hidden",
        userSelect: "none",
        zIndex: this.nextMove ? 3 : 0,
      };
    },
    mobileNextContentRightStyle() {
      var w = this.isMobile ? this.width * 0.9 : this.width * 0.45;
      var h = this.height * 0.9;
      // var boxL = Math.sqrt(w * w + h * h)
      var deg = 0 - this.nextDegree;
      var dx = 0 - this.nextX;
      return {
        position: "absolute",
        width: w + "px",
        height: h + "px",
        top: "auto",
        bottom: "0%",
        right: "100%",
        left: "auto",
        transform:
          "translate(" +
          dx +
          "px, " +
          this.nextY +
          "px) rotate(" +
          deg +
          "deg)",
        transformOrigin: "100% 100%",
        overflow: "hidden",
        userSelect: "none",
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
        .then((data) => this.pages.push(...data));
    },
    computeDeg(that, x0, y0) {
      // TODO: what if x0 = x1 or y0 = y1
      var x1 = that.width * 0.95;
      var y1 = that.height * 0.95;
      if (x0 === x1) x0 = x1 - 1;
      if (y0 === y1) y0 = y1 - 1;
      var y = ((x0 - x1) / (y1 - y0)) * ((x1 - x0) / 2) + (y0 + y1) / 2;
      var x = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)) / 2;
      var alpha = Math.asin(x / (y1 - y));
      // var x2 = x1 - (y1 - y) * Math.sin(alpha)
      // var y2 = y + (y1 - y) * Math.cos(alpha)
      that.nextX = 0 - x;
      that.nextY = 0 - x * Math.tan(alpha);
      that.nextContainer = 0 - (y1 - y) * Math.tan(alpha);
      that.nextDegree = (alpha / Math.PI) * 180;
      // console.log((x2 - x1) * (x2 - x1) + (y2 - y) * (y2 - y), (y1 - y) * (y1 - y), y2, (x0 - x1) / (y1 - y0) * x2 + (y0 + y1) / 2 - (x0 * x0 - x1 * x1) / (2 * (y1 - y0)))
    },
    turningAnimationPhase1(that) {
      if (that.nextMove === true) {
        // console.log('x: ' + e.x + ' y: ' + e.y)
        var alpha = (that.nextDegree * Math.PI) / 180;
        var newnextX1 =
          0 - that.width * (that.isMobile ? 0.9 : 0.45) * Math.cos(alpha);
        var newnextY1 =
          0 - that.width * (that.isMobile ? 0.9 : 0.45) * Math.sin(alpha);
        var old2x = 0 - that.nextX;
        var old2deg = 0 - that.nextDegree;
        var new2x1 = 0 - newnextX1;
        var newnextContainer = 0 - that.width * (that.isMobile ? 0.9 : 0.45);
        const nextContentLeftMove = [
          {
            transform:
              "translate(" +
              that.nextX +
              "px, " +
              that.nextY +
              "px) rotate(" +
              that.nextDegree +
              "deg)",
          },
          {
            transform:
              "translate(" +
              newnextX1 +
              "px, " +
              newnextY1 +
              "px) rotate(" +
              that.nextDegree +
              "deg)",
          },
        ];
        const nextContentRightMove = [
          {
            transform:
              "translate(" +
              old2x +
              "px, " +
              that.nextY +
              "px) rotate(" +
              old2deg +
              "deg)",
          },
          {
            transform:
              "translate(" +
              new2x1 +
              "px, " +
              newnextY1 +
              "px) rotate(" +
              old2deg +
              "deg)",
          },
        ];
        const nextContainerLeftMove = [
          {
            transform:
              "translateX(" +
              that.nextContainer +
              "px) rotate(" +
              that.nextDegree +
              "deg)",
          },
          {
            transform:
              "translateX(" +
              newnextContainer +
              "px) rotate(" +
              that.nextDegree +
              "deg)",
          },
        ];
        const nextContainerRightMove = [
          {
            transform:
              "translateX(" +
              that.nextContainer +
              "px) rotate(" +
              that.nextDegree +
              "deg)",
          },
          {
            transform:
              "translateX(" +
              newnextContainer +
              "px) rotate(" +
              that.nextDegree +
              "deg)",
          },
        ];
        const duration1 = { duration: 1000 };
        that.nextContentLeft.animate(nextContentLeftMove, duration1);
        that.nextContentRight.animate(nextContentRightMove, duration1);
        that.nextContainerLeft.animate(nextContainerLeftMove, duration1);
        that.nextContainerRight.animate(nextContainerRightMove, duration1);
      }
    },
    turningAnimationPhase2(that) {
      if (that.nextMove === true) {
        var old2deg = 0 - that.nextDegree;
        var newnextContainer = 0 - that.width * (that.isMobile ? 0.9 : 0.45);
        var newnextX2 = 0 - that.width * (that.isMobile ? 0.9 : 0.45);
        var newnextY2 = 0;
        var new2x2 = 0 - newnextX2;
        console.log("nextDegreeree: " + that.nextDegree);
        const nextContentLeftRotate = [
          {
            transform:
              "translate(" +
              newnextX2 +
              "px, " +
              newnextY2 +
              "px) rotate(" +
              that.nextDegree +
              "deg)",
            transformOrigin: "100% 100%",
          },
          {
            transform:
              "translate(" +
              newnextX2 +
              "px, " +
              newnextY2 +
              "px) rotate(0deg)",
            transformOrigin: "100% 100%",
          },
        ];
        const nextContentRightRotate = [
          {
            transform:
              "translate(" +
              new2x2 +
              "px, " +
              newnextY2 +
              "px) rotate(" +
              old2deg +
              "deg)",
            transformOrigin: "0% 100%",
          },
          {
            transform:
              "translate(" + new2x2 + "px, " + newnextY2 + "px) rotate(0deg)",
            transformOrigin: "0% 100%",
          },
        ];
        const nextContainerLeftRotate = [
          {
            transform:
              "translateX(" +
              newnextContainer +
              "px) rotate(" +
              that.nextDegree +
              "deg)",
          },
          { transform: "translateX(" + newnextContainer + "px) rotate(0deg)" },
        ];
        const nextContainerRightRotate = [
          {
            transform:
              "translateX(" +
              newnextContainer +
              "px) rotate(" +
              that.nextDegree +
              "deg)",
          },
          { transform: "translateX(" + newnextContainer + "px) rotate(0deg)" },
        ];
        var duration2 = { duration: 1000, delay: 1000 };
        that.nextContentLeft.animate(nextContentLeftRotate, duration2);
        console.log(new2x2, newnextY2, old2deg);
        var myanimation = that.nextContentRight.animate(
          nextContentRightRotate,
          duration2
        );
        that.nextContainerLeft.animate(nextContainerLeftRotate, duration2);
        that.nextContainerRight.animate(nextContainerRightRotate, duration2);
        myanimation.onfinish = () => {
          that.nextX = 0;
          that.nextY = 0;
          that.nextContainer = 0;
          that.nextDegree = 0;
          that.page = (that.page + (that.isMobile ? 1 : 2)) % that.pages.length;
          that.nextContainerLeft.style.zIndex = 0;
          that.busy = false;
          that.nextMove = false;
        };
      }
    },
    outofRange(that, e) {
      var x1 = that.width * 0.95;
      var y1 = that.height * 0.95;
      var x0, y0, x;
      if (that.isMobile) {
        x0 = e.touches[0].clientX;
        y0 = e.touches[0].clientY;
        x = ((y1 - y0) / (x0 - x1)) * ((y1 - y0) / 2) + (x0 + x1) / 2;
        if (x <= that.width * 0.1) {
          return true;
        }
      } else {
        x0 = e.x;
        y0 = e.y;
        x = ((y1 - y0) / (x0 - x1)) * ((y1 - y0) / 2) + (x0 + x1) / 2;
        if (x <= that.width * 0.5) {
          return true;
        }
      }
      return false;
    },
    moveOutSide(e) {
      console.log("move outside");
      if (this.nextMove) {
        console.log("move outside");
        var x = this.isMobile ? e.touches[0].clientX : e.x;
        var y = this.isMobile ? e.touches[0].clientY : e.y;
        if (
          x >= this.width * 0.95 ||
          x <= this.width * 0.05 ||
          y >= this.height * 0.95 ||
          y <= this.height * 0.05
        ) {
          this.$options.methods.turningAnimationPhase1(this);
          this.$options.methods.turningAnimationPhase2(this);
        }
      }
    },
    mouseDownHandler(e) {
      if (this.isMobile) return;
      console.log("here mouse down");
      if (!this.nextContentLeft) {
        this.nextContentLeft = document.querySelector(".mobileNextContentLeft");
        this.nextContentRight = document.querySelector(
          ".mobile-next-content-right"
        );
        this.nextContainerLeft = document.querySelector(
          ".mobileNextContainerLeft"
        );
        this.nextContainerRight = document.querySelector(
          ".mobile-next-container-right"
        );
      }
      this.nextContainerLeft.style.zIndex = 2;
      var brX = this.width * 0.95;
      var brY = this.height * 0.95;
      console.log(e.x, e.y);
      if (
        e.x <= brX &&
        e.x >= brX - this.width * 0.3 &&
        e.y <= brY &&
        e.y >= brY - this.height * 0.3
      ) {
        this.nextMove = true;
        this.$options.methods.computeDeg(this, e.x, e.y);
      }
    },
    mouseUpHandler() {
      if (this.isMobile) return;
      this.$options.methods.turningAnimationPhase1(this);
      this.$options.methods.turningAnimationPhase2(this);
    },
    mouseMoveHandler(e) {
      if (this.isMobile) return;
      if (this.nextMove) {
        if (this.$options.methods.outofRange(this, e)) {
          this.$options.methods.turningAnimationPhase2(this);
          return;
        }
        this.$options.methods.computeDeg(this, e.x, e.y);
      }
    },
    mobileStart(e) {
      if (this.busy) return;
      console.log("touch start at", e.touches[0].clientX, e.touches[0].clientY);
      if (!this.isMobile) return;
      if (!this.nextContentLeft) {
        this.nextContentLeft = document.querySelector(".mobileNextContentLeft");
        this.nextContentRight = document.querySelector(
          ".mobile-next-content-right"
        );
        this.nextContainerLeft = document.querySelector(
          ".mobileNextContainerLeft"
        );
        this.nextContainerRight = document.querySelector(
          ".mobile-next-container-right"
        );
      }
      this.nextContainerLeft.style.zIndex = 2;
      var brX = this.width * 0.95;
      var brY = this.height * 0.95;
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;
      console.log(e.x, e.y);
      if (
        x <= brX &&
        x >= brX - this.width * 0.3 &&
        y <= brY &&
        y >= brY - this.height * 0.3
      ) {
        this.nextMove = true;
        this.$options.methods.computeDeg(this, x, y);
      }
    },
    mobileMove(e) {
      if (this.busy) return;
      console.log("touch move");
      if (!this.isMobile) return;
      if (this.nextMove) {
        if (this.$options.methods.outofRange(this, e)) {
          this.$options.methods.turningAnimationPhase2(this);
          return;
        }
        this.$options.methods.computeDeg(
          this,
          e.touches[0].clientX,
          e.touches[0].clientY
        );
      }
    },
    mobileEnd() {
      if (this.busy) return;
      console.log("touch end");
      if (!this.isMobile) return;
      this.busy = true;
      this.$options.methods.turningAnimationPhase1(this);
      this.$options.methods.turningAnimationPhase2(this);
    },
  },
  mounted() {
    window.width = window.innerWidth;
    window.height = window.innerHeight;
    this.width = window.width;
    this.height = window.height;
    this.diagonal = Math.sqrt(
      this.width * this.width + this.height * this.height
    );
  },
};
</script>
