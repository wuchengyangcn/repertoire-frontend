<template>
  <div class="repertoire" @touchstart="touchStartHandler($event)">
    <div class="page" v-html="this.html_code[this.index]"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "RepertoireComponnet",
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
