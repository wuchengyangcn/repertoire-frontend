<!--
Copyright (C) 2023 musicnbrain.org

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
-->

<template>
  <div
    class="repertoire"
    v-bind:style="repertoireStyle"
    @touchstart="flipStart($event)"
    @touchmove="flipMove($event)"
    @touchend="flipEnd()"
    @mousedown="flipStart($event)"
    @mousemove="flipMove($event)"
    @mouseup="flipEnd()"
  >
    <!-- 2 pages for current contents -->
    <div
      class="curr-content-left"
      v-bind:style="currContentLeftStyle"
      v-html="isMobile ? '' : pages[page]"
    ></div>
    <div
      class="curr-content-right"
      v-bind:style="currContentRightStyle"
      v-html="pages[isMobile ? page : (page + 1) % pages.length]"
    ></div>
    <!-- wrapper for next 2 pages -->
    <div class="next-container-left" v-bind:style="nextContainerLeftStyle">
      <div
        class="next-content-left"
        v-bind:style="nextContentLeftStyle"
        v-html="pages[isMobile ? '' : (page + 2) % pages.length]"
      ></div>
    </div>
    <div class="next-container-right" v-bind:style="nextContainerRightStyle">
      <div
        class="next-content-right"
        v-bind:style="nextContentRightStyle"
        v-html="
          pages[
            isMobile ? (page + 1) % pages.length : (page + 3) % pages.length
          ]
        "
      ></div>
    </div>
    <!-- wrapper for prev 2 pages -->
    <div class="prev-container-left" v-bind:style="prevContainerLeftStyle">
      <div
        class="prev-content-left"
        v-bind:style="prevContentLeftStyle"
        v-html="
          pages[
            isMobile
              ? (page - 1 + pages.length) % pages.length
              : (page - 2 + pages.length) % pages.length
          ]
        "
      ></div>
    </div>
    <div class="prev-container-right" v-bind:style="prevContainerRightStyle">
      <div
        class="prev-content-right"
        v-bind:style="prevContentRightStyle"
        v-html="pages[isMobile ? '' : (page - 1 + pages.length) % pages.length]"
      ></div>
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
      // margin size
      margin: 0.05,
      // hot corner box size
      box: 0.3,
      height: 0,
      width: 0,
      diagonal: 0,
      // control params for flipping to next page
      nextX: 0,
      nextY: 0,
      nextDegree: 0,
      nextContainer: 0,
      nextMove: false,
      nextContentLeft: "",
      nextContentRight: "",
      nextContainerLeft: "",
      nextContainerRight: "",
      // control params for flipping to prev page
      prevX: 0,
      prevY: 0,
      prevDegree: 0,
      prevContainer: 0,
      prevMove: false,
      prevContentLeft: "",
      prevContentRight: "",
      prevContainerLeft: "",
      prevContainerRight: "",
    };
  },
  props: ["repertoireId"],
  computed: {
    repertoireStyle() {
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
    currContentLeftStyle() {
      return {
        position: "absolute",
        height: (1 - 2 * this.margin) * this.height + "px",
        width:
          (this.isMobile ? 1 - 2 * this.margin : 0.5 - this.margin) *
            this.width +
          "px",
        top: this.margin * this.height + "px",
        bottom: this.margin * this.height + "px",
        left: this.margin * this.width + "px",
        right: (this.isMobile ? this.margin : 0.5) * this.width + "px",
        overflow: "hidden",
        userSelect: "none",
        zIndex: 1,
        boxShadow: "0px 0px 5px 5px #888888",
      };
    },
    currContentRightStyle() {
      return {
        position: "absolute",
        height: (1 - 2 * this.margin) * this.height + "px",
        width:
          (this.isMobile ? 1 - 2 * this.margin : 0.5 - this.margin) *
            this.width +
          "px",
        top: this.margin * this.height + "px",
        bottom: this.margin * this.height + "px",
        left: (this.isMobile ? this.margin : 0.5) * this.width + "px",
        right: this.margin * this.width + "px",
        overflow: "hidden",
        userSelect: "none",
        zIndex: 1,
        boxShadow: "0px 0px 5px 5px #888888",
      };
    },
    nextContainerLeftStyle() {
      return {
        position: "absolute",
        width: (1 - 2 * this.margin) * this.diagonal + "px",
        height: (1 - 2 * this.margin) * this.diagonal + "px",
        top: "auto",
        bottom: this.margin * this.height + "px",
        left: "auto",
        right: this.margin * this.width + "px",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${this.nextContainer}px) rotate(${this.nextDegree}deg)`,
        transformOrigin: "100% 100%",
        zIndex: this.nextMove ? 2 : 0,
      };
    },
    nextContentLeftStyle() {
      return {
        position: "absolute",
        width:
          (this.isMobile ? 1 - 2 * this.margin : 0.5 - this.margin) *
            this.width +
          "px",
        height: (1 - 2 * this.margin) * this.height + "px",
        top: "auto",
        bottom: "0%",
        left: "100%",
        right: "auto",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${this.nextX}px) translateY(${this.nextY}px) rotate(${this.nextDegree}deg)`,
        transformOrigin: "0% 100%",
        zIndex: this.nextMove ? 3 : 0,
        backgroundColor: this.isMobile ? "white" : "transparent",
        boxShadow: "0px 0px 5px 5px #888888",
      };
    },
    nextContainerRightStyle() {
      return {
        position: "absolute",
        width: (1 - 2 * this.margin) * this.diagonal + "px",
        height: (1 - 2 * this.margin) * this.diagonal + "px",
        top: "auto",
        bottom: this.margin * this.height + "px",
        left: (1 - this.margin) * this.width + "px",
        right: "auto",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${this.nextContainer}px) rotate(${this.nextDegree}deg)`,
        transformOrigin: "0% 100%",
        zIndex: this.nextMove ? 2 : 0,
      };
    },
    nextContentRightStyle() {
      return {
        position: "absolute",
        width:
          (this.isMobile ? 1 - 2 * this.margin : 0.5 - this.margin) *
            this.width +
          "px",
        height: (1 - 2 * this.margin) * this.height + "px",
        top: "auto",
        bottom: "0%",
        left: "auto",
        right: "100%",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${-this.nextX}px) translateY(${
          this.nextY
        }px) rotate(${-this.nextDegree}deg`,
        transformOrigin: "100% 100%",
        zIndex: this.nextMove ? 3 : 0,
        boxShadow: "0px 0px 5px 5px #888888",
      };
    },
    prevContainerLeftStyle() {
      return {
        position: "absolute",
        width: (1 - 2 * this.margin) * this.diagonal + "px",
        height: (1 - 2 * this.margin) * this.diagonal + "px",
        top: "auto",
        bottom: this.margin * this.height + "px",
        right: (1 - this.margin) * this.width + "px",
        left: "auto",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${this.prevContainer}px) rotate(${this.prevDegree}deg)`,
        transformOrigin: "100% 100%",
        zIndex: this.prevMove ? 2 : 0,
      };
    },
    prevContentLeftStyle() {
      return {
        position: "absolute",
        width:
          (this.isMobile ? 1 - 2 * this.margin : 0.5 - this.margin) *
            this.width +
          "px",
        height: (1 - 2 * this.margin) * this.height + "px",
        top: "auto",
        bottom: "0%",
        left: "100%",
        right: "auto",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${-this.prevX}px) translateY(${
          this.prevY
        }px) rotate(${-this.prevDegree}deg)`,
        transformOrigin: "0% 100%",
        zIndex: this.prevMove ? 3 : 0,
        boxShadow: "0px 0px 5px 5px #888888",
      };
    },
    prevContainerRightStyle() {
      return {
        position: "absolute",
        width: (1 - 2 * this.margin) * this.diagonal + "px",
        height: (1 - 2 * this.margin) * this.diagonal + "px",
        top: "auto",
        bottom: this.margin * this.height + "px",
        left: this.margin * this.width + "px",
        right: "auto",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${this.prevContainer}px) rotate(${this.prevDegree}deg)`,
        transformOrigin: "0% 100%",
        zIndex: this.prevMove ? 2 : 0,
      };
    },
    prevContentRightStyle() {
      return {
        position: "absolute",
        width:
          (this.isMobile ? 1 - 2 * this.margin : 0.5 - this.margin) *
            this.width +
          "px",
        height: (1 - 2 * this.margin) * this.height + "px",
        top: "auto",
        bottom: "0%",
        left: "auto",
        right: "100%",
        overflow: "hidden",
        userSelect: "none",
        transform: `translateX(${this.prevX}px) translateY(${this.prevY}px) rotate(${this.prevDegree}deg)`,
        transformOrigin: "100% 100%",
        zIndex: this.prevMove ? 3 : 0,
        backgroundColor: this.isMobile ? "white" : "transparent",
        boxShadow: "0px 0px 5px 5px #888888",
      };
    },
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize() {
      this.isMobile = "ontouchstart" in document.documentElement;
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      if (this.width === 1170 && this.height === 2532) {
        this.model = "ip14";
      } else {
        this.model = "mobile";
      }
      this.diagonal = Math.sqrt(
        (this.isMobile ? 1 : 0.25) * this.width * this.width +
          this.height * this.height
      );
      const remote = "3.17.80.6:5001";
      // const local = "localhost:5001";
      const url = `http://${remote}/repertoire?device=${
        this.isMobile ? this.model : "desktop"
      }&id=${this.repertoireId}`;
      fetch(url, { mode: "cors" })
        .then((response) => response.json())
        .then((data) => this.pages.push(...data));
    },
    nextUpdate(that, x0, y0) {
      // update params for flipping to next page
      let x1 = (1 - that.margin) * that.width;
      let y1 = (1 - that.margin) * that.height;
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
    nextFlip(that) {
      // animate flipping to next page
      that.busy = true;
      let alpha = (that.nextDegree * Math.PI) / 180;
      let newNextX =
        -(that.isMobile ? 1 - 2 * that.margin : 0.5 - that.margin) *
        that.width *
        Math.cos(alpha);
      let newNextY =
        -(that.isMobile ? 1 - 2 * that.margin : 0.5 - that.margin) *
        that.width *
        Math.sin(alpha);
      let newNextContainer =
        -(that.isMobile ? 1 - 2 * that.margin : 0.5 - that.margin) * that.width;
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
      let lastStep = that.nextContentRight.animate(rightContent, duration);
      lastStep.onfinish = () => {
        that.nextSpin(that);
      };
    },
    nextSpin(that) {
      // animate spinning to next page
      that.busy = true;
      let newNextX =
        -(that.isMobile ? 1 - 2 * that.margin : 0.5 - that.margin) * that.width;
      let newNextContainer =
        -(that.isMobile ? 1 - 2 * that.margin : 0.5 - that.margin) * that.width;
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
      const duration = { duration: 1000 };
      that.nextContainerLeft.animate(leftContainer, duration);
      that.nextContentLeft.animate(leftContent, duration);
      that.nextContainerRight.animate(rightContainer, duration);
      let lastStep = that.nextContentRight.animate(rightContent, duration);
      lastStep.onfinish = () => {
        that.nextX = 0;
        that.nextY = 0;
        that.nextDegree = 0;
        that.nextContainer = 0;
        that.page = (that.page + (that.isMobile ? 1 : 2)) % that.pages.length;
        that.nextMove = false;
        that.busy = false;
      };
    },
    prevUpdate(that, x0, y0) {
      // update params for flipping to prev page
      let x1 = that.margin * that.width;
      let y1 = (1 - that.margin) * that.height;
      if (x0 === x1) x0 = x1 + 1;
      if (y0 === y1) y0 = y1 - 1;
      let y = ((x0 - x1) / (y1 - y0)) * ((x1 - x0) / 2) + (y0 + y1) / 2;
      let x = Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1)) / 2;
      let alpha = Math.asin(x / (y1 - y));
      that.prevX = x;
      that.prevY = -x * Math.tan(alpha);
      that.prevDegree = -(alpha / Math.PI) * 180;
      that.prevContainer = (y1 - y) * Math.tan(alpha);
    },
    prevFlip(that) {
      // animate flipping to prev page
      that.busy = true;
      let alpha = (that.prevDegree * Math.PI) / 180;
      let newPrevX =
        (that.isMobile ? 1 - 2 * that.margin : 0.5 - that.margin) *
        that.width *
        Math.cos(alpha);
      let newPrevY =
        (that.isMobile ? 1 - 2 * that.margin : 0.5 - that.margin) *
        that.width *
        Math.sin(alpha);
      let newPrevContainer =
        (that.isMobile ? 1 - 2 * that.margin : 0.5 - that.margin) * that.width;
      const leftContainer = [
        {
          transform: `translateX(${that.prevContainer}px) rotate(${that.prevDegree}deg)`,
        },
        {
          transform: `translateX(${newPrevContainer}px) rotate(${that.prevDegree}deg)`,
        },
      ];
      const leftContent = [
        {
          transform: `translateX(${-that.prevX}px) translateY(${
            that.prevY
          }px) rotate(${-that.prevDegree}deg)`,
        },
        {
          transform: `translateX(${-newPrevX}px) translateY(${newPrevY}px) rotate(${-that.prevDegree}deg)`,
        },
      ];
      const rightContainer = [
        {
          transform: `translateX(${that.prevContainer}px) rotate(${that.prevDegree}deg)`,
        },
        {
          transform: `translateX(${newPrevContainer}px) rotate(${that.prevDegree}deg)`,
        },
      ];
      const rightContent = [
        {
          transform: `translateX(${that.prevX}px) translateY(${that.prevY}px) rotate(${that.prevDegree}deg)`,
        },
        {
          transform: `translateX(${newPrevX}px) translateY(${newPrevY}px) rotate(${that.prevDegree}deg)`,
        },
      ];
      const duration = { duration: 1000 };
      that.prevContainerLeft.animate(leftContainer, duration);
      that.prevContentLeft.animate(leftContent, duration);
      that.prevContainerRight.animate(rightContainer, duration);
      let lastStep = that.prevContentRight.animate(rightContent, duration);
      lastStep.onfinish = () => {
        that.prevSpin(that);
      };
    },
    prevSpin(that) {
      // animate spinning to prev page
      that.busy = true;
      let newPrevX =
        (that.isMobile ? 1 - 2 * that.margin : 0.5 - that.margin) * that.width;
      let newPrevContainer =
        (that.isMobile ? 1 - 2 * that.margin : 0.5 - that.margin) * that.width;
      const leftContainer = [
        {
          transform: `translateX(${newPrevContainer}px) rotate(${that.prevDegree}deg)`,
        },
        {
          transform: `translateX(${newPrevContainer}px) rotate(0deg)`,
        },
      ];
      const leftContent = [
        {
          transform: `translateX(${-newPrevX}px) translateY(0px) rotate(${-that.prevDegree}deg)`,
          transformOrigin: "100% 100%",
        },
        {
          transform: `translateX(${-newPrevX}px) translateY(0px) rotate(0deg)`,
          transformOrigin: "100% 100%",
        },
      ];
      const rightContainer = [
        {
          transform: `translateX(${newPrevContainer}px) rotate(${that.prevDegree}deg)`,
        },
        {
          transform: `translateX(${newPrevContainer}px) rotate(0deg)`,
        },
      ];
      const rightContent = [
        {
          transform: `translateX(${newPrevX}px) translateY(0px) rotate(${that.prevDegree}deg)`,
          transformOrigin: "0% 100%",
        },
        {
          transform: `translateX(${newPrevX}px) translateY(0px) rotate(0deg)`,
          transformOrigin: "0% 100%",
        },
      ];
      const duration = { duration: 1000 };
      that.prevContainerLeft.animate(leftContainer, duration);
      that.prevContentLeft.animate(leftContent, duration);
      that.prevContainerRight.animate(rightContainer, duration);
      let lastStep = that.prevContentRight.animate(rightContent, duration);
      lastStep.onfinish = () => {
        that.prevX = 0;
        that.prevY = 0;
        that.prevDegree = 0;
        that.prevContainer = 0;
        that.page =
          (that.page - (that.isMobile ? 1 : 2) + that.pages.length) %
          that.pages.length;
        that.prevMove = false;
        that.busy = false;
      };
    },
    flipStart(event) {
      // avoid conflict
      if (this.busy || this.nextMove || this.prevMove) return;
      let x = this.isMobile ? event.touches : event.clientX;
      let y = this.isMobile ? event.touches : event.clientY;
      if (x === undefined || y === undefined) return;
      if (this.isMobile) {
        x = x[0].clientX;
        y = y[0].clientY;
      }
      // location in bottom right hot corner
      if (
        x <= (1 - this.margin) * this.width &&
        x >= (1 - this.margin - this.box) * this.width &&
        y <= (1 - this.margin) * this.height &&
        y >= (1 - this.margin - this.box) * this.height
      ) {
        // get references to components
        this.nextContainerLeft = document.querySelector(".next-container-left");
        this.nextContentLeft = document.querySelector(".next-content-left");
        this.nextContainerRight = document.querySelector(
          ".next-container-right"
        );
        this.nextContentRight = document.querySelector(".next-content-right");
        this.nextMove = true;
        this.nextUpdate(this, x, y);
        return;
      }
      // location in bottom left hot corner
      if (
        x <= (this.margin + this.box) * this.width &&
        x >= this.margin * this.width &&
        y <= (1 - this.margin) * this.height &&
        y >= (1 - this.margin - this.box) * this.height
      ) {
        // get references to components
        this.prevContainerLeft = document.querySelector(".prev-container-left");
        this.prevContentLeft = document.querySelector(".prev-content-left");
        this.prevContainerRight = document.querySelector(
          ".prev-container-right"
        );
        this.prevContentRight = document.querySelector(".prev-content-right");
        this.prevMove = true;
        this.prevUpdate(this, x, y);
        return;
      }
    },
    flipMove(event) {
      // avoid conflict
      if (this.busy) return;
      let x = this.isMobile ? event.touches : event.clientX;
      let y = this.isMobile ? event.touches : event.clientY;
      if (x === undefined || y === undefined) return;
      if (this.isMobile) {
        x = x[0].clientX;
        y = y[0].clientY;
      }
      if (this.nextMove) {
        // location out of window
        if (
          x > (1 - this.margin) * this.width ||
          x < (this.isMobile ? this.margin : 0.5) * this.width ||
          y > (1 - this.margin) * this.height ||
          y < this.margin * this.height
        ) {
          this.nextFlip(this);
          return;
        }
        // avoid ripping
        let x0 = (1 - this.margin) * this.width;
        let y0 = (1 - this.margin) * this.height;
        let tip = ((y0 - y) / (x - x0)) * ((y0 - y) / 2) + (x + x0) / 2;
        if (tip < (this.isMobile ? this.margin : 0.5) * this.width) {
          this.nextSpin(this);
          return;
        }
        this.nextUpdate(this, x, y);
        return;
      }
      if (this.prevMove) {
        // location out of window
        if (
          x > (this.isMobile ? 1 - this.margin : 0.5) * this.width ||
          x < this.margin * this.width ||
          y > (1 - this.margin) * this.height ||
          y < this.margin * this.height
        ) {
          this.prevFlip(this);
          return;
        }
        // avoid ripping
        let x0 = this.margin * this.width;
        let y0 = (1 - this.margin) * this.height;
        let tip = ((y0 - y) / (x - x0)) * ((y0 - y) / 2) + (x + x0) / 2;
        if (tip > (this.isMobile ? 1 - this.margin : 0.5) * this.width) {
          this.prevSpin(this);
          return;
        }
        this.prevUpdate(this, x, y);
        return;
      }
    },
    flipEnd() {
      // avoid conflict
      if (this.busy) return;
      if (this.nextMove) {
        this.nextFlip(this);
        return;
      }
      if (this.prevMove) {
        this.prevFlip(this);
        return;
      }
    },
  },
};
</script>
