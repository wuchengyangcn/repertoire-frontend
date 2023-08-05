<template>
  <div
    id="curling"
    class="wrapper"
    @mousemove="moveOutSide($event)"
    @touchmove="touchMoveHandler($event)"
    @touchend="touchEndHandler()"
  >
    <div
      class="corner"
      @mousedown="mouseDownHandler($event)"
      @touchstart="touchStartHandler($event)"
    ></div>
    <div v-if="!isMobile" v-html="htmlCode[ind]" class="page leftpage"></div>
    <div
      class="page rightpage"
      v-html="htmlCode[isMobile ? ind : (ind + 1) % htmlCode.length]"
      :style="rightPageStl"
    ></div>
    <div
      class="turn-wrapper"
      :style="turnWrapperStl"
      @mousedown="mouseDownHandler($event)"
      @mouseup="mouseUpHandler($)"
      @mousemove="mouseMoveHandler($event)"
      @touchstart="touchStartHandler($event)"
      @touchmove="touchMoveHandler($event)"
      @touchend="touchEndHandler($)"
    >
      <div
        class="turn-page"
        v-html="isMobile ? '' : htmlCode[(ind + 2) % htmlCode.length]"
        :style="turnPageStl"
      ></div>
    </div>
    <div class="turn-wrapper2" :style="turnWrapper2Stl">
      <div
        class="turn-page2"
        v-html="htmlCode[(isMobile ? ind + 1 : ind + 3) % htmlCode.length]"
        :style="turnPage2Stl"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "Repertoire",
      nameList: [
        "Cat",
        "American Shorthair",
        "British Shorthair",
        "Chartreux",
        "Ragdoll",
        "Siamese cat",
        "Persian cat",
        "Russian Blue",
      ],
      urlPrefix: "../../static/",
      urlSuffix: " - Wikipedia.html",
      htmlCode: [],
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      ready: true,
      rightdeg: 0,
      moveEventFlag: false,
      rightOrigin: 0,
      transX: 0,
      transY: 0,
      wrapX: 0,
      page1: "",
      page2: "",
      wrap1: "",
      wrap2: "",
      corner: "",
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
      var w = this.isMobile ? this.screenWidth * 0.9 : this.screenWidth * 0.45;
      var h = this.screenHeight * 0.9;
      var boxL = Math.sqrt(w * w + h * h);
      return {
        width: boxL + "px",
        height: boxL + "px",
        top: "auto",
        bottom: this.screenHeight * 0.05 + "px",
        right: this.screenWidth * 0.05 + "px",
        left: "auto",
        transform:
          "translateX(" + this.wrapX + "px) rotate(" + this.rightdeg + "deg)",
        transformOrigin: "100% 100%",
      };
    },
    turnWrapper2Stl: function () {
      var w = this.isMobile ? this.screenWidth * 0.9 : this.screenWidth * 0.45;
      var h = this.screenHeight * 0.9;
      var boxL = Math.sqrt(w * w + h * h);
      return {
        width: boxL + "px",
        height: boxL + "px",
        top: "auto",
        bottom: this.screenHeight * 0.05 + "px",
        left: this.screenWidth * 0.95 + "px",
        right: "auto",
        transform:
          "translateX(" + this.wrapX + "px) rotate(" + this.rightdeg + "deg)",
        transformOrigin: "0% 100%",
      };
    },
    turnPageStl: function () {
      var w = this.isMobile ? this.screenWidth * 0.9 : this.screenWidth * 0.45;
      var h = this.screenHeight * 0.9;
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
          this.transX +
          "px, " +
          this.transY +
          "px) rotate(" +
          this.rightdeg +
          "deg)",
        transformOrigin: "0% 100%",
        backgroundColor: this.isMobile ? "white" : "",
        // backgroundColor: 'white'
      };
    },
    turnPage2Stl: function () {
      var w = this.isMobile ? this.screenWidth * 0.9 : this.screenWidth * 0.45;
      var h = this.screenHeight * 0.9;
      // var boxL = Math.sqrt(w * w + h * h)
      var deg = 0 - this.rightdeg;
      var dx = 0 - this.transX;
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
          this.transY +
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
        .then((data) => this.htmlCode.push(...data));
    },
    computeDeg(that, x0, y0) {
      // TODO: what if x0 = x1 or y0 = y1
      var x1 = that.screenWidth * 0.95;
      var y1 = that.screenHeight * 0.95;
      if (x0 === x1) x0 = x1 - 1;
      if (y0 === y1) y0 = y1 - 1;
      var y = ((x0 - x1) / (y1 - y0)) * ((x1 - x0) / 2) + (y0 + y1) / 2;
      var x = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)) / 2;
      var alpha = Math.asin(x / (y1 - y));
      // var x2 = x1 - (y1 - y) * Math.sin(alpha)
      // var y2 = y + (y1 - y) * Math.cos(alpha)
      that.transX = 0 - x;
      that.transY = 0 - x * Math.tan(alpha);
      that.wrapX = 0 - (y1 - y) * Math.tan(alpha);
      that.rightdeg = (alpha / Math.PI) * 180;
      // console.log((x2 - x1) * (x2 - x1) + (y2 - y) * (y2 - y), (y1 - y) * (y1 - y), y2, (x0 - x1) / (y1 - y0) * x2 + (y0 + y1) / 2 - (x0 * x0 - x1 * x1) / (2 * (y1 - y0)))
    },
    turningAnimationPhase1(that) {
      if (that.moveEventFlag === true) {
        // console.log('x: ' + e.x + ' y: ' + e.y)
        var alpha = (that.rightdeg * Math.PI) / 180;
        var newtransX1 =
          0 - that.screenWidth * (that.isMobile ? 0.9 : 0.45) * Math.cos(alpha);
        var newtransY1 =
          0 - that.screenWidth * (that.isMobile ? 0.9 : 0.45) * Math.sin(alpha);
        var old2x = 0 - that.transX;
        var old2deg = 0 - that.rightdeg;
        var new2x1 = 0 - newtransX1;
        var newWrapX = 0 - that.screenWidth * (that.isMobile ? 0.9 : 0.45);
        const page1Move = [
          {
            transform:
              "translate(" +
              that.transX +
              "px, " +
              that.transY +
              "px) rotate(" +
              that.rightdeg +
              "deg)",
          },
          {
            transform:
              "translate(" +
              newtransX1 +
              "px, " +
              newtransY1 +
              "px) rotate(" +
              that.rightdeg +
              "deg)",
          },
        ];
        const page2Move = [
          {
            transform:
              "translate(" +
              old2x +
              "px, " +
              that.transY +
              "px) rotate(" +
              old2deg +
              "deg)",
          },
          {
            transform:
              "translate(" +
              new2x1 +
              "px, " +
              newtransY1 +
              "px) rotate(" +
              old2deg +
              "deg)",
          },
        ];
        const wrap1Move = [
          {
            transform:
              "translateX(" +
              that.wrapX +
              "px) rotate(" +
              that.rightdeg +
              "deg)",
          },
          {
            transform:
              "translateX(" + newWrapX + "px) rotate(" + that.rightdeg + "deg)",
          },
        ];
        const wrap2Move = [
          {
            transform:
              "translateX(" +
              that.wrapX +
              "px) rotate(" +
              that.rightdeg +
              "deg)",
          },
          {
            transform:
              "translateX(" + newWrapX + "px) rotate(" + that.rightdeg + "deg)",
          },
        ];
        const duration1 = { duration: 1000 };
        that.page1.animate(page1Move, duration1);
        that.page2.animate(page2Move, duration1);
        that.wrap1.animate(wrap1Move, duration1);
        that.wrap2.animate(wrap2Move, duration1);
      }
    },
    turningAnimationPhase2(that) {
      if (that.moveEventFlag === true) {
        that.moveEventFlag = false;
        var old2deg = 0 - that.rightdeg;
        var newWrapX = 0 - that.screenWidth * (that.isMobile ? 0.9 : 0.45);
        var newtransX2 = 0 - that.screenWidth * (that.isMobile ? 0.9 : 0.45);
        var newtransY2 = 0;
        var new2x2 = 0 - newtransX2;
        console.log("rightdegree: " + that.rightdeg);
        const page1Rotate = [
          {
            transform:
              "translate(" +
              newtransX2 +
              "px, " +
              newtransY2 +
              "px) rotate(" +
              that.rightdeg +
              "deg)",
            transformOrigin: "100% 100%",
          },
          {
            transform:
              "translate(" +
              newtransX2 +
              "px, " +
              newtransY2 +
              "px) rotate(0deg)",
            transformOrigin: "100% 100%",
          },
        ];
        const page2Rotate = [
          {
            transform:
              "translate(" +
              new2x2 +
              "px, " +
              newtransY2 +
              "px) rotate(" +
              old2deg +
              "deg)",
            transformOrigin: "0% 100%",
          },
          {
            transform:
              "translate(" + new2x2 + "px, " + newtransY2 + "px) rotate(0deg)",
            transformOrigin: "0% 100%",
          },
        ];
        const wrap1Rotate = [
          {
            transform:
              "translateX(" + newWrapX + "px) rotate(" + that.rightdeg + "deg)",
          },
          { transform: "translateX(" + newWrapX + "px) rotate(0deg)" },
        ];
        const wrap2Rotate = [
          {
            transform:
              "translateX(" + newWrapX + "px) rotate(" + that.rightdeg + "deg)",
          },
          { transform: "translateX(" + newWrapX + "px) rotate(0deg)" },
        ];
        var duration2 = { duration: 1000, delay: 1000 };
        that.page1.animate(page1Rotate, duration2);
        console.log(new2x2, newtransY2, old2deg);
        var myanimation = that.page2.animate(page2Rotate, duration2);
        that.wrap1.animate(wrap1Rotate, duration2);
        that.wrap2.animate(wrap2Rotate, duration2);
        myanimation.onfinish = () => {
          that.transX = 0;
          that.transY = 0;
          that.wrapX = 0;
          that.rightdeg = 0;
          that.ind =
            (that.ind + (that.isMobile ? 1 : 2)) % that.htmlCode.length;
          that.wrap1.style.zIndex = 0;
          that.corner.style.zIndex = 4;
          console.log(that.ind);
        };
      }
    },
    outofRange(that, e) {
      var x1 = that.screenWidth * 0.95;
      var y1 = that.screenHeight * 0.95;
      var x0, y0, x;
      if (that.isMobile) {
        x0 = e.touches[0].clientX;
        y0 = e.touches[0].clientY;
        x = ((y1 - y0) / (x0 - x1)) * ((y1 - y0) / 2) + (x0 + x1) / 2;
        if (x <= that.screenWidth * 0.1) {
          return true;
        }
      } else {
        x0 = e.x;
        y0 = e.y;
        x = ((y1 - y0) / (x0 - x1)) * ((y1 - y0) / 2) + (x0 + x1) / 2;
        if (x <= that.screenWidth * 0.5) {
          return true;
        }
      }
      return false;
    },
    moveOutSide(e) {
      console.log("move outside");
      if (this.moveEventFlag) {
        console.log("move outside");
        var x = this.isMobile ? e.touches[0].clientX : e.x;
        var y = this.isMobile ? e.touches[0].clientY : e.y;
        if (
          x >= this.screenWidth * 0.95 ||
          x <= this.screenWidth * 0.05 ||
          y >= this.screenHeight * 0.95 ||
          y <= this.screenHeight * 0.05
        ) {
          this.$options.methods.turningAnimationPhase1(this);
          this.$options.methods.turningAnimationPhase2(this);
        }
      }
    },
    mouseDownHandler(e) {
      if (this.isMobile) return;
      console.log("here mouse down");
      if (!this.page1) {
        this.page1 = document.querySelector(".turn-page");
        this.page2 = document.querySelector(".turn-page2");
        this.wrap1 = document.querySelector(".turn-wrapper");
        this.wrap2 = document.querySelector(".turn-wrapper2");
        this.corner = document.querySelector(".corner");
      }
      this.wrap1.style.zIndex = 2;
      this.corner.style.zIndex = 0;
      var brX = this.screenWidth * 0.95;
      var brY = this.screenHeight * 0.95;
      console.log(e.x, e.y);
      if (
        e.x <= brX &&
        e.x >= brX - this.screenWidth * 0.3 &&
        e.y <= brY &&
        e.y >= brY - this.screenHeight * 0.3
      ) {
        console.log(
          this.isMobile ? "touch start in corner" : "mousedown in corner"
        );
        this.moveEventFlag = true;
        this.$options.methods.computeDeg(this, e.x, e.y);
      } else {
        console.log(
          this.isMobile
            ? "touch start not in corner"
            : "mousedown not in corner"
        );
      }
    },
    mouseUpHandler() {
      if (this.isMobile) return;
      this.$options.methods.turningAnimationPhase1(this);
      this.$options.methods.turningAnimationPhase2(this);
    },
    mouseMoveHandler(e) {
      if (this.isMobile) return;
      if (this.moveEventFlag) {
        if (this.$options.methods.outofRange(this, e)) {
          this.$options.methods.turningAnimationPhase2(this);
          return;
        }
        this.$options.methods.computeDeg(this, e.x, e.y);
      }
    },
    touchStartHandler(e) {
      console.log("touch start at", e.touches[0].clientX, e.touches[0].clientY);
      if (!this.isMobile) return;
      if (!this.page1) {
        this.page1 = document.querySelector(".turn-page");
        this.page2 = document.querySelector(".turn-page2");
        this.wrap1 = document.querySelector(".turn-wrapper");
        this.wrap2 = document.querySelector(".turn-wrapper2");
        this.corner = document.querySelector(".corner");
      }
      this.wrap1.style.zIndex = 2;
      this.corner.style.zIndex = 0;
      var brX = this.screenWidth * 0.95;
      var brY = this.screenHeight * 0.95;
      var x = e.touches[0].clientX;
      var y = e.touches[0].clientY;
      console.log(e.x, e.y);
      if (
        x <= brX &&
        x >= brX - this.screenWidth * 0.3 &&
        y <= brY &&
        y >= brY - this.screenHeight * 0.3
      ) {
        console.log(
          this.isMobile ? "touch start in corner" : "mousedown in corner"
        );
        this.moveEventFlag = true;
        this.$options.methods.computeDeg(this, x, y);
      } else {
        console.log(
          this.isMobile
            ? "touch start not in corner"
            : "mousedown not in corner"
        );
      }
    },
    touchMoveHandler(e) {
      console.log("touch move");
      if (!this.isMobile) return;
      if (this.moveEventFlag) {
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
      console.log("touch end");
      if (!this.isMobile) return;
      this.$options.methods.turningAnimationPhase1(this);
      this.$options.methods.turningAnimationPhase2(this);
    },
  },
  mounted() {
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = window.innerWidth;
        window.screenHeight = window.innerHeight;
        that.screenWidth = window.screenWidth;
        that.screenHeight = window.screenHeight;
        that.rightX = window.screenWidth * 0.95;
        that.resizeFlag = that.resizeFlag < 1000000 ? that.resizeFlag + 1 : 0;
      })();
    };
    if (this.isMobile) {
      window.addEventListener("touchstart", {});
    }
  },
  watch: {
    resizeFlag() {
      if (!this.timer) {
        this.timer = true;
        let that = this;
        setTimeout(function () {
          console.log(
            "screenWidth: " +
              that.screenWidth +
              "  screenHeight: " +
              that.screenHeight
          );
          that.timer = false;
        }, 400);
      }
    },
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

.turn-page2 {
  position: absolute;
  overflow: hidden;
}

.corner {
  position: absolute;
  width: 30%;
  height: 30%;
  right: 5%;
  left: auto;
  bottom: 5%;
  top: auto;
  z-index: 4;
  border-style: none;
  overflow: hidden;
}
</style>
