<template>
  <div class="page-wrapper">
    <div id="control-cursor">
      <div class="cursor-button" @click="showCursor">显示光标</div>
      <div class="cursor-button" @click="hideCursor">隐藏光标</div>
      <div class="cursor-button" @click="nextCursor">下一步</div>
      <div class="cursor-button" @click="resetCursor">重置</div>
      <div class="cursor-button" @click="play">整曲播放</div>
      <div class="cursor-button" @click="playNote">播放单音</div>
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
      
      var scoreUrl = "MuzioClementi_SonatinaOpus36No1_Part1.xml"; // "https://opensheetmusicdisplay.github.io/demo/sheets/MuzioClementi_SonatinaOpus36No3_Part1.xml"
      var localScoreUrl = `/musicXML/${scoreUrl}`;

      // 初始化
      this.MusicEngine = new MusicEngine({
        el: "#osmd-score",
        options: {
          // backend: "canvas" // canvas | svg 使用canvas，无法加载cursor
          backendType:0,
          defaultColorNotehead: "#FFA500", // 头
          defaultColorStem: "#4169E1", // 干
          defaultColorRest: "	#C71585", // 休止符
          defaultColorLabel: "#8A2BE2", // 休止符文字
          drawTitle: false, // 绘制标题
          drawSubtitle: false, // 绘制子标题
          drawComposer: false,
          drawCredits: false,
          disableCursor:false,
          // drawLyricist: false
          // drawFingerings: false,
          drawPartNames: true, // try false
          fillEmptyMeasuresWithWholeRest: 0,
          fingeringPosition: "above",
          // tupletsBracketed: true, // creates brackets for all tuplets except triplets, even when not set by xml
          // tupletsRatioed: true, // unconventional; renders ratios for tuplets (3:2 instead of 3 for triplets)
          // tripletsBracketed: true,
          // autoBeam: true, // try true, OSMD Function Test AutoBeam sample
          // autoBeamOptions: {
            // beam_rests: true
            // beam_middle_rests_only: false,
            // groups: [[3,4], [1,1]],
            // maintain_stem_directions: false
          // }
        }
      });

      // 加载乐曲
      await this.MusicEngine.loadScore(localScoreUrl);
      // this.MusicEngine.osmd.EngravingRules.MeasureNumberLabelOffset = 4;
      // 渲染
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
    playNote() {
      var randomNumber = this.Random(16, 64);
      this.MusicEngine.playNote(randomNumber);
    },
    Random(min, max) {
      return Math.round(Math.random() * (max - min)) + min;
    },
    callFlutter(){
      Toast.postMessage("JS调用了Flutter");
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