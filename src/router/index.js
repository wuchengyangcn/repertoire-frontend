/*
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
*/

import { createRouter, createWebHistory } from "vue-router";
import BarcodeView from "@/views/BarcodeView.vue";
import RepertoireView from "@/views/RepertoireView.vue";
import UploadView from "@/views/UploadView.vue";

const routes = [
  {
    path: "/",
    name: "default",
    component: BarcodeView,
    props: {
      barcodeId: "1",
    },
  },
  {
    path: "/barcode/:barcodeId",
    name: "barcode",
    component: BarcodeView,
    props: true,
  },
  {
    path: "/repertoire/:repertoireId",
    name: "repertoire",
    component: RepertoireView,
    props: true,
  },
  {
    path: "/upload",
    name: "upload",
    component: UploadView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((from, to, next) => {
  document.title = "MusicNBrain";
  next();
});

export default router;
