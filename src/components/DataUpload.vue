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
  <div class="upload">
    <div class="front-block">
      <div class="front-header" @click="showFront = !showFront">Front</div>
      <div class="front-body" v-if="showFront">
        <div class="input-group">
          <div class="front-label">Title</div>
          <input class="front-text" v-model="front.title" />
        </div>
        <div class="input-group">
          <div class="front-label">Subtitle</div>
          <input class="front-text" type="text" v-model="front.subtitle" />
        </div>
        <div class="input-group">
          <div class="front-label">Time</div>
          <input class="front-text" type="text" v-model="front.time" />
        </div>
        <div class="input-group">
          <div class="front-label">Location</div>
          <input class="front-text" type="text" v-model="front.location" />
        </div>
        <div class="input-group">
          <div class="front-label">Address</div>
          <input class="front-text" type="text" v-model="front.address" />
        </div>
        <div class="input-group">
          <div class="front-label">Background</div>
          <input class="front-text" type="text" v-model="front.background" />
        </div>
      </div>
    </div>
    <div class="content-block">
      <div class="content-header">
        <div class="content-toggle" @click="showContent = !showContent">
          Content
        </div>
        <button
          class="add-button"
          @click="
            content.push({
              show: false,
              performer: 'sample performer' + content.length,
              pieces: [
                {
                  title: 'sample title0',
                  composer: 'sample composer0',
                },
              ],
            })
          "
        >
          +
        </button>
        <button class="remove-button" @click="content.pop()">-</button>
      </div>
      <div class="content-body" v-if="showContent">
        <div class="items" v-for="(item, index) in content" :key="index">
          <div class="performer-header">
            <div class="performer-toggle" @click="item.show = !item.show">
              {{ item.performer }}
            </div>
            <button
              class="add-button"
              @click="
                item.pieces.push({
                  title: 'sample title' + item.pieces.length,
                  composer: 'sample composer' + item.pieces.length,
                })
              "
            >
              +
            </button>
            <button class="remove-button" @click="item.pieces.pop()">-</button>
          </div>
          <div class="performer-body" v-if="item.show">
            <div
              class="items"
              v-for="(piece, index) in item.pieces"
              :key="index"
            >
              <div class="input-group">
                <div class="content-label">Title</div>
                <input class="content-text" type="text" v-model="piece.title" />
              </div>
              <div class="input-group">
                <div class="content-label">Composer</div>
                <input
                  class="content-text"
                  type="text"
                  v-model="piece.composer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="back-block">
      <div class="back-header">
        <div class="back-toggle" @click="showBack = !showBack">Back</div>
        <button
          class="add-button"
          @click="
            back.push({
              icon: 'sample icon' + back.length,
              name: 'sample name' + back.length,
            })
          "
        >
          +
        </button>
        <button class="remove-button" @click="back.pop()">-</button>
      </div>
      <div class="back-body" v-if="showBack">
        <div class="items" v-for="(item, index) in back" :key="index">
          <div class="input-group">
            <div class="back-label">Icon</div>
            <input class="back-text" type="text" v-model="item.icon" />
          </div>
          <div class="input-group">
            <div class="back-label">Name</div>
            <input class="back-text" type="text" v-model="item.name" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="submit-block">
    <div class="submit-header">
      <button
        class="submit-button"
        @click="
          this.data = {
            front: front,
            content: content,
            back: back,
          }
        "
      >
        Submit
      </button>
    </div>
    <div class="submit-body">
      <div class="submit-text">{{ data }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "Upload",
      showFront: false,
      showContent: false,
      showBack: false,
      front: {
        title: "sample title",
        subtitle: "sample subtitle",
        time: "sample time",
        location: "sample location",
        address: "sample address",
        background: "sample background",
      },
      content: [
        {
          show: false,
          performer: "sample performer0",
          pieces: [
            {
              title: "sample title0",
              composer: "sample composer0",
            },
          ],
        },
      ],
      back: [
        {
          icon: "sample icon0",
          name: "sample name0",
        },
      ],
      data: {},
    };
  },
};
</script>

<style scoped>
.front-block {
  margin: 10px;
}

.front-header {
  font-size: 4vw;
  background-color: #bbbbbb;
  text-align: center;
  color: blue;
  user-select: none;
}

.input-group {
  display: flex;
  margin: 10px;
}

.front-label {
  font-size: 2vw;
  flex: 1;
  text-align: right;
  margin-right: 10px;
}

.front-text {
  font-size: 2vw;
  flex: 4;
  text-align: left;
}

.content-block {
  margin: 10px;
}

.content-header {
  display: flex;
  background-color: #bbbbbb;
  user-select: none;
}

.content-toggle {
  font-size: 4vw;
  text-align: center;
  color: blue;
  flex: 18;
}

.items {
  margin-top: 10px;
}

.performer-header {
  display: flex;
  background-color: #bbbbbb;
  user-select: none;
}

.performer-toggle {
  margin: auto auto;
  font-size: 2vw;
  text-align: center;
  color: blue;
  flex: 18;
}

.content-label {
  font-size: 2vw;
  flex: 1;
  text-align: right;
  margin-right: 10px;
}

.content-text {
  font-size: 2vw;
  flex: 4;
  text-align: left;
}

.back-block {
  margin: 10px;
}

.back-header {
  display: flex;
  background-color: #bbbbbb;
  user-select: none;
}

.back-toggle {
  font-size: 4vw;
  text-align: center;
  color: blue;
  flex: 18;
}

.back-label {
  font-size: 2vw;
  flex: 1;
  text-align: right;
  margin-right: 5px;
}

.back-text {
  font-size: 2vw;
  flex: 4;
  text-align: left;
}

.add-button {
  font-size: 4vw;
  flex: 1;
}

.remove-button {
  font-size: 4vw;
  flex: 1;
}

.submit-block {
  margin: 10px;
}

.submit-header {
  display: flex;
  align-items: center;
}

.submit-button {
  font-size: 4vw;
  text-align: center;
  flex: 1;
}

.submit-body {
  font-size: 2vw;
}
</style>
