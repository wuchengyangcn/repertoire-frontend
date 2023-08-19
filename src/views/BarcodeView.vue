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
  <div class="barcode">
    <router-link to="/repertoire">
      <qrcode-vue v-bind:value="url" v-bind:size="size" />
    </router-link>
  </div>
</template>

<script>
import QrcodeVue from "qrcode.vue";

export default {
  data() {
    return {
      name: "BarcodeView",
      url: "localhost:8080/repertoire",
      size: Math.min(window.innerWidth, window.innerHeight) * 0.9,
    };
  },
  components: {
    QrcodeVue,
  },
};
</script>

<style scoped>
.barcode {
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
