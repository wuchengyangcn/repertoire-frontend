<template>
  <div
    id="curling"
    class="wrapper"
    @mousedown="mouseDownHandler($event)"
    @mousemove="moveOutSide($event)"
    @mouseup="mouseUpHandler()"
    @touchstart="touchStartHandler($event)"
    @touchmove="touchMoveHandler($event)"
    @touchend="touchEndHandler()"
  >
    <div v-if="!isMobile" v-html="pages[ind]" class="page leftpage"></div>
    <div
      class="page rightpage"
      v-html="pages[isMobile ? ind : (ind + 1) % pages.length]"
      :style="rightPageStl"
    ></div>
    <div class="turn-wrapper" :style="turnWrapperStl">
      <div
        class="turn-page"
        v-html="isMobile ? '' : pages[(ind + 2) % pages.length]"
        :style="turnPageStl"
      ></div>
    </div>
    <div class="turn-wrapper2" :style="turnWrapper2Stl">
      <div
        class="turn-nextContentRight"
        v-html="pages[(isMobile ? ind + 1 : ind + 3) % pages.length]"
        :style="turnnextContentRightStl"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "Repertoire",
      pages: [],
      width: 0,
      height: 0,
      nextDegree: 0,
      nextMove: false,
      nextX: 0,
      nextY: 0,
      nextContainer: 0,
      nextContentLeft: "",
      nextContentRight: "",
      nextContainerLeft: "",
      nextContainerRight: "",
      busy: false,
      ind: 0,
      isMobile: navigator.userAgent.match(
        /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
      ),
    };
  },
  computed: {
    rightPageStl: function () {
      return {
        width: this.isMobile ? "90%" : "45%",
      };
    },
    turnWrapperStl: function () {
      var w = this.isMobile ? this.width * 0.9 : this.width * 0.45;
      var h = this.height * 0.9;
      var boxL = Math.sqrt(w * w + h * h);
      return {
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
      };
    },
    turnWrapper2Stl: function () {
      var w = this.isMobile ? this.width * 0.9 : this.width * 0.45;
      var h = this.height * 0.9;
      var boxL = Math.sqrt(w * w + h * h);
      return {
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
      };
    },
    turnPageStl: function () {
      var w = this.isMobile ? this.width * 0.9 : this.width * 0.45;
      var h = this.height * 0.9;
      // var boxL = Math.sqrt(w * w + h * h)
      return {
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
        backgroundColor: this.isMobile ? "white" : "",
        // backgroundColor: 'white'
      };
    },
    turnnextContentRightStl: function () {
      var w = this.isMobile ? this.width * 0.9 : this.width * 0.45;
      var h = this.height * 0.9;
      // var boxL = Math.sqrt(w * w + h * h)
      var deg = 0 - this.nextDegree;
      var dx = 0 - this.nextX;
      return {
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
        that.nextMove = false;
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
          that.ind = (that.ind + (that.isMobile ? 1 : 2)) % that.pages.length;
          that.nextContainerLeft.style.zIndex = 0;
          that.busy = false;
          console.log(that.ind);
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
        this.nextContentLeft = document.querySelector(".turn-page");
        this.nextContentRight = document.querySelector(
          ".turn-nextContentRight"
        );
        this.nextContainerLeft = document.querySelector(".turn-wrapper");
        this.nextContainerRight = document.querySelector(".turn-wrapper2");
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
    touchStartHandler(e) {
      if (this.busy) return;
      console.log("touch start at", e.touches[0].clientX, e.touches[0].clientY);
      if (!this.isMobile) return;
      if (!this.nextContentLeft) {
        this.nextContentLeft = document.querySelector(".turn-page");
        this.nextContentRight = document.querySelector(
          ".turn-nextContentRight"
        );
        this.nextContainerLeft = document.querySelector(".turn-wrapper");
        this.nextContainerRight = document.querySelector(".turn-wrapper2");
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
    touchMoveHandler(e) {
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
    touchEndHandler() {
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
    this.rightX = this.width * 0.95;
  },
};
</script>

<style scoped>
.wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;
}
.page {
  width: 45%;
  height: 90%;
  display: inline-block;
  position: absolute;
  top: 5%;
  bottom: auto;
  z-index: 1;
  overflow: hidden;
}

.leftpage {
  left: 5%;
  right: auto;
}

.rightpage {
  left: auto;
  right: 5%;
}

.turn-wrapper {
  position: absolute;
  z-index: 0;
  border-color: blue;
  overflow: hidden;
}

.turn-wrapper2 {
  position: absolute;
  z-index: 2;
  border-color: blue;
  overflow: hidden;
}

.turn-page {
  position: absolute;
  z-index: 3;
  overflow: hidden;
}

.turn-nextContentRight {
  position: absolute;
  overflow: hidden;
}
</style>
