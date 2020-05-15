<template>
  <div class="page-wrapper">
    <div id="control-cursor">
      <div class="cursor-button" @click="showCursor">显示光标</div>
      <div class="cursor-button" @click="hideCursor">隐藏光标</div>
      <div class="cursor-button" @click="nextCursor">下一步</div>
      <div class="cursor-button" @click="resetCursor">重置</div>
      <div class="cursor-button" @click="play">整曲播放</div>
      <div class="cursor-button" @click="followCursor">光标跟随</div>
      <div class="cursor-button" @click="partIntercept">部分截取</div>
      <div class="cursor-button" @click="callFlutter">调用flutter方法</div>
    </div>
    <!-- <div id="p-wrapper">
      <ul id="piano">
        {keys}
      </ul>
    </div>-->
    <div id="osmd-score" class="score" />
  </div>
</template>

<script>
import axios from "axios";
import { OpenSheetMusicDisplay, AJAX } from "opensheetmusicdisplay";
import MusicEngine from "@/utils/musicEngine/MusicEngine";

export default {
  name: "score",
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.initMusicEngine();
  },
  methods: {
    async initMusicEngine() {
      
      var scoreUrl = "MuzioClementi_SonatinaOpus36No1_Part1.xml"; // remote path："https://opensheetmusicdisplay.github.io/demo/sheets/MuzioClementi_SonatinaOpus36No3_Part1.xml"
      var localScoreUrl = `/musicXML/${scoreUrl}`;

      // 初始化
      this.MusicEngine = new MusicEngine({
        el: "#osmd-score",
        options: {
          // backend: "canvas" // canvas | svg use canvas with can't render cursor
          backendType:0,
          defaultColorNotehead: "#FFA500", 
          defaultColorStem: "#4169E1", 
          defaultColorRest: "	#C71585",
          defaultColorLabel: "#8A2BE2",
          drawTitle: false,
          drawSubtitle: false,
          drawComposer: false,
          drawCredits: false,
          disableCursor:false,
          drawPartNames: true,
        }
      });

      await this.MusicEngine.loadScore(localScoreUrl);
      // this.MusicEngine.osmd.EngravingRules.MeasureNumberLabelOffset = 4;
      // this.MusicEngine.setZoom(0.8);
      // await this.$nextTick();
      this.MusicEngine.render();
    },
    showCursor() {
      this.MusicEngine.showCursor();
    },
    hideCursor() {
      this.MusicEngine.hideCursor();
    },
    nextCursor() {
      this.MusicEngine.nextCursor();
    },
    resetCursor() {
      this.MusicEngine.resetCursor();
    },
    play() {
      this.MusicEngine.play();
    },
    followCursor() {
      this.MusicEngine.followCursor(true);
    },
    partIntercept() {
      this.MusicEngine.sliceMeasure(2, 3);
      this.MusicEngine.sliceMeasure(6, 7);
    },
    measureHighlight() {
      this.MusicEngine.setMeasureHighlight(2, 3);
      this.MusicEngine.render();
    },
    Random(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    },
    callFlutter(){
      FlutterToast.postMessage("JS调用了Flutter");
    }
  }
};
</script>
<style lang="scss" scoped>
.page-wrapper {
  width: 100%;
  height: auto;
}
#control-cursor {
  display: flex;
  flex-direction: row;
}

#control-cursor .cursor-button {
  padding: 5px;
  margin-right: 10px;
  margin-top: 10px;
  background-color: #cccccc;
  border-radius: 6px;
  cursor: pointer;
}
</style>