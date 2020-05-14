
// 小节选取光标
export default class Subsection{
  _hidden = true;
  constructor(el, openSheetMusicDisplay) {
    this.defaultSpeed = 80;
    this.src = "";
    this.STOREEXAMPLE = [];
    this.el = el;
    this.osmd = openSheetMusicDisplay;
    this.sheet = openSheetMusicDisplay.sheet;
    this.subsection = null;
    this.createSubsectionCursorImg(el);
  }
  createSubsectionCursorImg(container) {
    const curs = document.createElement("img");
    curs.style.position = "absolute";
    curs.style.zIndex = "-1";
    this.subsection = curs;
    container.appendChild(curs);
  }
  get hidden() {
    return this._hidden;
  }
  set hidden(state) {
    this._hidden = state;
  }

  show() {
    this._hidden = false;
    this.update();
  }
  update() {
    if (this._hidden) {
      return;
    }
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

  // / measureList --> stave
  renderRect(ctx) {
    this.osmd.backend.ctx.save();
    this.osmd.backend.ctx.fillStyle = "rgba(255,0,0,0.4)";
    // this.osmd.backend.ctx.fillRect(229, 397, 225, 100); // 尝试画区域遮罩,位置不准确
    // this.osmd.backend.ctx.fillRect(240.7560310625, 110, 14, 14); // 音符位置,准确
    // this.osmd.backend.ctx.fillRect(366.9492, 100, 20, 130); // 音符位置
    this.osmd.backend.ctx.fillRect(371.9492, 100, 10, 130); // 音符位置

    this.testOsmdPosition();

    // x,y数据来源
    // console.log(this.osmd.graphic.measureList[0][0].staffEntries[0][0].graphicalVoiceEntries[0].notes.PositionAndShape.DataObject.PositionAndShape.AbsolutePosition);

    // var xuniCanvas = this.osmd.backend.ctx.initializeHeadless();
    // console.log(xuniCanvas);
  }

  clearRect() {
    this.osmd.backend.ctx.save();
    this.osmd.backend.ctx.clear(229, 397, 225, 100);
    this.osmd.backend.ctx.restore();
  }

  scroll(beatsPer, numLines, width, context) {
    this.fillIn(this.defaultSpeed, beatsPer, width, numLines, context);
  }
  fillIn(tempo, beatsPer, width, numLines, ctx) {
    // called every 20 milliseconds, goes speed pixels to the right.
    // if bpm === 4 and tempo = 60, we want 230 pixels for 4 seconds = 57.5 px / sec = 57.5 / 50 px per 20 ms

    // 230 px / 3 seconds = 230 / 4 * 4/3
    var speed = tempo / 48 * 4 / beatsPer;
    console.log(speed);
    var lineCounter = 1;
    var initial = -speed * 49;
    var distFromTop = 40;
    var f = function() {
      // console.log('f going');
      ctx.fillRect(75, distFromTop, initial, 150);
      // console.log(initial);
    };
    var move = function() {
      // console.log('move going');
      initial += speed;
      if (initial > width && lineCounter < numLines) {
        distFromTop += 200;
        lineCounter += 1;
        initial = 0;
      } else if (initial > width && lineCounter === numLines) {
        clearInterval(id);
        clearTimeout(id2);
      }
    };
    var id2;
    var fMove = function() {
      // console.log('fmove going');
      id2 = setTimeout(f, 1000);
      move();
    };
    var id = setInterval(fMove, 20);
    // $("#stop-start-over-1").click(function() {
    //   // console.log('click ending');
    //   exitFunction = 1;
    //   clearInterval(id);
    //   clearTimeout(id2);
    //   var clear = function() {
    //     clearAndReplace(ctx);
    //   };
    //   var done = setTimeout(clear, 1000);
    // });
  }
}
