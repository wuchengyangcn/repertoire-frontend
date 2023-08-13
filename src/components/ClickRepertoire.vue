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
  <div class="repertoire" @touchstart="touchStartHandler($event)">
    <div v-html="this.html_code[this.index]"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "Repertoire",
      device: "mobile",
      html_code: [],
      index: 0,
      height: 0,
      width: 0,
    };
  },
  created() {
    this.readHtmlFiles();
  },
  methods: {
    readHtmlFiles() {
      const domain = `http://127.0.0.1:5000/repertoire?device=${this.device}`;
      fetch(domain)
        .then((data) => data.json())
        .then((data) => this.html_code.push(...data));
    },
    touchStartHandler(event) {
      let x = event.touches[0].clientX;
      if (x < this.width / 2) {
        this.index =
          (this.index - 1 + this.html_code.length) % this.html_code.length;
      } else {
        this.index = (this.index + 1) % this.html_code.length;
      }
    },
  },
  mounted() {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  },
};
</script>
