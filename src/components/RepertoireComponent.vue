<template>
  <div class="repertoire">Hello World!</div>
</template>

<script>
export default {
  data() {
    return {
      name: "RepertoireComponnet",
      device: "mobile",
      html_code: [],
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
  },
};
</script>
