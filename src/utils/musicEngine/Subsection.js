var Raphael = require("raphael");
import Stave from "./Graphical/stave";
import RaphaelGraphical from "./Graphical/RaphaelGraphical";
import { Fraction } from "opensheetmusicdisplay";

// 本地项目：soundslice-svg-master
export default class Subsection{
  constructor(el, openSheetMusicDisplay) {
    this.el = el;
    this.osmd = openSheetMusicDisplay;
    this.sheet = openSheetMusicDisplay.sheet;
    this.unitInPixels = 10; // osmd基准尺寸  //VexFlowMusicSheetDrawer.ts
    this.xmin = 0;
    this.xmax = this.osmd.container.clientWidth - 90; // 拖动界限 - 滚动条
    this.ymin = 10;
    this.ymax = this.osmd.container.clientHeight;
    // 拖动事件.
    this.x = 10;
    this.y0 = 10;
    this.dx = 0;
    this.timer = null;
    this.currentMeasure = null;
    this.setStart = null;
    this.setEnd = null;
    this.initStave();
  }

  show() {
    this.el.appendChild(this.stave.container);
    // this.init(this.el);

    this.showMultMeasureMark();
  }
  async showMultMeasureMark(start = 0, end = 1) {
    this.el.appendChild(this.stave.container);

    // 源码位置: src\MusicalScore\MusicSheet.ts
    this.currentMeasure = this.sheet.getFirstSourceMeasure();

    var paper = Raphael(this.stave.container);
    this.setStart = paper.set();
    // this.setEnd = paper.set();

    var measureList = this.sheet.SourceMeasures;

    var startStave = measureList[start].verticalMeasureList[0].stave;
    var endStave = measureList[end].verticalMeasureList[0].stave;

    var startMarkLine = RaphaelGraphical.drawLineStart(
      paper,
      startStave.x,
      startStave.y
    );
    var endMarkLine = RaphaelGraphical.drawLineEnd(
      paper,
      endStave.x,
      endStave.y
    );

    this.setStart.push(startMarkLine);
    // this.setStart.push(endMarkLine);

    var oneRect = RaphaelGraphical.drawRect(paper);

    // 使用循环创建
    // measureList.forEach((item, index) => {
    //   if (index === parseInt(start) || index === parseInt(end)) {
    //     leftList = item.verticalMeasureList[0];
    //     console.log(leftList.stave);

    //     var oneMarkLine = RaphaelGraphical.drawLine(
    //       paper,
    //       leftList.stave.x,
    //       leftList.stave.y
    //     );
    //     this.setStart.push(oneMarkLine);
    //     this.setStart.drag(this.onmove.bind(this), this.onstart.bind(this));
    //   }
    // });

    // 发光特效
    var glow = this.setStart.glow({
      swidth: 8,
      fill: true,
      color: "rgb(232,129,61)"
    });
    glow.hide();
    this.setStart.push(glow);
    this.glow = glow;

    this.setStart.drag(this.onmove.bind(this), this.onstart.bind(this));
    // 悬浮事件
    startMarkLine.hover(this.hoverin.bind(this), this.hoverout.bind(this));

    this.update();
  }

  async init() {
    var that = this;
    // var currentVerticalMeasureList = this.testOsmdPosition();

    // 源码位置: src\MusicalScore\MusicSheet.ts
    this.currentMeasure = this.sheet.getFirstSourceMeasure();
    console.log(this.currentMeasure);
    console.log(this.osmd);

    var idx1 = this.getIndexMeasureStave(1);

    // console.log(this.sheet.SourceMeasures[3].verticalMeasureList[0].stave);
    // console.log(idx1);
    var measureX = this.currentMeasure.x;
    var measureY = this.currentMeasure.y;

    var paper = Raphael(this.stave.container);
    this.set = paper.set();

    var markLine = RaphaelGraphical.drawLine(paper, measureX, measureY);
    this.set.push(markLine);
    console.log(this.set);

    // 发光特效
    var glow = this.set.glow({
      swidth: 8,
      fill: true,
      color: "rgb(232,129,61)"
    });
    glow.hide();
    this.set.push(glow);
    this.glow = glow;

    // 拖动事件.
    this.x = 10;
    this.y0 = 10;
    this.dx = 0;

    // 拖动事件
    this.set.drag(this.onmove.bind(this), this.onstart.bind(this));
    // 悬浮事件
    markLine.hover(this.hoverin.bind(this), this.hoverout.bind(this));

    this.update();
    await setTimeout(() => {}, 0);
  }

  initStave() {
    var that = this;
    setTimeout(() => {
      if (!that.stave) {
        that.stave = Stave.getInstance(that.osmd.container);
      }
    }, 0);
  }

  /**
   * 高亮显示特定小节中的音符
   *
   * @param {*} startMeasureNumber
   * @param {*} endMeasureNumber
   * @param {*} hightlightColor
   * @returns
   * @memberof MusicEngine
   */
  setRangeNoteHighlight(
    startMeasureNumber,
    endMeasureNumber,
    startNoteIndex,
    endNoteIndex,
    hightlightColor
  ) {
    console.log(this.osmd.graphic);
    if (
      isNaN(startMeasureNumber) ||
      isNaN(endMeasureNumber) ||
      isNaN(startNoteIndex) ||
      isNaN(endNoteIndex)
    ) { return; }

    var measureList = this.osmd.graphic.measureList;

    measureList.forEach((item, index) => {
      if (index >= startMeasureNumber && index <= endMeasureNumber) {
        console.log(index);
        item.forEach((element, idx) => {
          element.staffEntries.forEach((m, mdx) => {
            m.graphicalVoiceEntries[0].notes.forEach((t, noteIdx) => {
              // console.log(noteIdx);
              // console.log(t.PositionAndShape.DataObject.PositionAndShape.AbsolutePosition);

              if (index == startMeasureNumber) {
                console.log(t);
                console.log("startNoteIndex:", startNoteIndex, noteIdx);
                console.log("endNoteIndex:", endNoteIndex, noteIdx);
              }
              t.sourceNote.noteheadColor = hightlightColor || "#8A2BE2";
            });

            // m.graphicalVoiceEntries[0].notes[0].sourceNote.noteheadColor = hightlightColor || "#8A2BE2";
          });
        });
      }
    });
  }

  // / measureList --> stave
  renderRect(ctx) {
    this.osmd.backend.ctx.save();
    this.osmd.backend.ctx.fillStyle = "rgba(255,0,0,0.4)";
    this.osmd.backend.ctx.fillRect(371.9492, 100, 10, 130);
    this.testOsmdPosition();
  }
  clearRect() {
    this.osmd.backend.ctx.save();
    this.osmd.backend.ctx.clear(229, 397, 225, 100);
    this.osmd.backend.ctx.restore();
  }

  testOsmdPosition() {
    console.log(this.osmd);

    var measureList = this.sheet.SourceMeasures;
    for (let index = 0; index < measureList.length; index++) {
      const element = measureList[index];
    }
    console.log(this.sheet.SourceMeasures[0].verticalMeasureList[0].stave);
    console.log(this.sheet.SourceMeasures[0].verticalMeasureList[1].stave);
    console.log(this.sheet.SourceMeasures[1].verticalMeasureList[0].stave);
    console.log(this.sheet.SourceMeasures[1].verticalMeasureList[1].stave.x);
    console.log(this.sheet.SourceMeasures[1].verticalMeasureList[1].stave.y);
  }

  getIndexMeasureStave(measuresIndex = 0) {
    return this.sheet.SourceMeasures[measuresIndex].verticalMeasureList[0]
      .stave;
  }

  onmove(dx, dy, x, y) {
    this.dx = dx;
    this.update();
  }
  onstart() {
    this.x += this.dx;
    this.dx = 0;
  }
  update() {
    //  staveWidth 替换this.xmax尝试
    var staveWidth = parseInt(this.stave.container.style.width.split("px")[0]);

    var x = Math.min(Math.max(this.x + this.dx, this.xmin), this.xmax);
    this.setStart.transform("T" + x + "," + this.y0);
  }
  // 发光
  hoverin() {
    this.glow.show();
  }
  // 发光
  hoverout() {
    this.glow.hide();
  }
}
