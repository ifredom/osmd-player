import Soundfont from "soundfont-player";
import axios from "axios";
import { OpenSheetMusicDisplay, Cursor } from "opensheetmusicdisplay";

import InstrumentService from "./core/InstrumentService";

import { ArticulationStyle } from "./enum/NotePlaybackOptions";
import Subsection from "./Subsection";
import Soundslice from "./soundslice";
import PlaybackScheduler from "./PlaybackScheduler";

// / 使用canvas库raphael渲染操作控件.

/**
 * 播放状态
 * INIT: 默认，未播放.
 * PLAYING：播放中
 * STOPPED: 停止
 * PAUSED: 暂停
 *
 * @param {*} PlaybackState
 */
const PlaybackState = {
  INIT: "INIT",
  PLAYING: "PLAYING",
  STOPPED: "STOPPED",
  PAUSED: "PAUSED"
};

// ctrl+ alt +d 生成注释
export default class MusicEngine {
  // 音频API: https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext
  constructor(options) {
    this.ac = new (window.AudioContext || window.webkitAudioContext)();
    this.ac.suspend();
    this.defaultBpm = 120;

    this.scoreUrl = null;

    // 音频服务
    this.InstrumentService = new InstrumentService();
    this.InstrumentService.init(this.ac);

    this.cursor = null;
    this.sheet = null;
    this.denominator = null;

    this.scheduler = null;

    this.iterationSteps = 0;
    this.currentIterationStep = 0;

    this.timeoutHandles = [];
    this.state = PlaybackState.INIT;
    this.scoreInstruments = [];
    this.ready = false;

    this.options = options.options;
    this.el = document.querySelector(options.el) || null;
    this.osmd = null;
    this.subsection = null;
    this.soundslice = null;

    this.playbackSettings = {
      instrument: "acoustic_grand_piano", // 默认乐器  ,官方默认乐曲为： MusyngKite
      bpm: this.defaultBpm,
      volumes: {
        master: 1, // 最大音量
        instruments: []
      }
    };

    if (options.el) {
      this.osmd = new OpenSheetMusicDisplay(this.el, options.options);
    }
  }

  async getInstanceOSMD(el, options) {
    const newInstance = new OpenSheetMusicDisplay(el, options);
    return newInstance;
  }

  get wholeNoteLength() {
    return Math.round(
      (60 / this.playbackSettings.bpm) * this.denominator * 1000
    );
  }

  // 加载乐曲后再初始化
  initControlStave() {
    this.subsection = new Subsection(this.el, this.osmd);
    this.soundslice = new Soundslice(this.el, this.osmd); // 显示遮罩以及动画，无法准确控制遮罩宽度，定位未尝试
  }

  // / tips: 这里需要注意必须执行 osmd.load()方法后，osmd.sheet才会存在
  async loadScore(scoreUrl) {
    this.ready = false;
    this.scoreUrl = scoreUrl;
    // this.osmd.clear();

    const scoreXml = await axios.get(scoreUrl);
    await this.osmd.load(scoreXml.data);

    console.log(this.osmd);

    if (this.osmd && this.osmd.sheet) {
      this.initControlStave();
      this.sheet = this.osmd.sheet;
      this.scoreInstruments = this.sheet.instruments;
      // this.cursor = new Cursor(this.el, this.osmd);
      this.cursor = this.osmd.cursor;

      console.log(this.cursor);

      this.denominator = this.sheet.playbackSettings.rhythm.denominator;
      if (this.sheet.HasBPMInfo) {
        this.setBpm(this.sheet.DefaultStartTempoInBpm);
      }

      await this._loadInstruments();

      this.scheduler = new PlaybackScheduler(
        this.denominator,
        this.wholeNoteLength,
        this.ac,
        (delay, notes) => this.notePlaybackCallback(delay, notes)
      );

      this._countAndSetIterationSteps();
      this.ready = true;
      this.state = PlaybackState.STOPPED;
    }
  }

  async _loadInstruments() {
    const playerPromises = [];
    for (const i of this.sheet.Instruments) {
      playerPromises.push(
        this.InstrumentService.loadInstrument(i.MidiInstrumentId)
      );
    }
    await Promise.all(playerPromises);

    // 设置乐器
    for (const i of this.sheet.Instruments) {
      for (const v of i.Voices) {
        v.midiInstrumentId = i.MidiInstrumentId;
      }
    }
    // 方便分别设置左右手音量
    const instruments = this.sheet.Instruments.map(i => {
      return {
        name: i.Name,
        id: i.id,
        voices: i.Voices.map(v => {
          return {
            name: "Voice " + v.VoiceId,
            id: v.VoiceId,
            volume: 1
          };
        })
      };
    });
    this.playbackSettings.volumes.instruments = instruments;
  }

  notePlaybackCallback(audioDelay, notes) {
    if (this.state !== PlaybackState.PLAYING) return;
    const scheduledNotes = new Map();

    for (const note of notes) {
      const noteDuration = this.getNoteDuration(note);
      if (noteDuration === 0) continue;
      const noteVolume = this.getNoteVolume(note);

      const midiPlaybackInstrument =
        note.ParentVoiceEntry.ParentVoice.midiInstrumentId;
      const fixedKey =
        note.ParentVoiceEntry.ParentVoice.Parent.SubInstruments[0].fixedKey ||
        0;

      if (!scheduledNotes.has(midiPlaybackInstrument)) {
        scheduledNotes.set(midiPlaybackInstrument, []);
      }

      scheduledNotes.get(midiPlaybackInstrument).push({
        note: note.halfTone - fixedKey * 12,
        duration: noteDuration / 1000,
        gain: noteVolume,
        articulation: ArticulationStyle.Spiccato
      });
    }

    for (const [midiId, notes] of scheduledNotes) {
      this.InstrumentService.schedule(
        midiId,
        this.ac.currentTime + audioDelay,
        notes
      );
    }

    this.timeoutHandles.push(
      setTimeout(
        () => this.iterationCallback(),
        Math.max(0, audioDelay * 1000 - 40)
      )
    ); // Subtracting 40 milliseconds to compensate for update delay
  }

  // Used to avoid duplicate cursor movements after a rapid pause/resume action
  _clearTimeouts() {
    for (let h of this.timeoutHandles) {
      clearTimeout(h);
    }
    this.timeoutHandles = [];
  }

  _countAndSetIterationSteps() {
    this.cursor.reset();
    let steps = 0;
    while (!this.cursor.Iterator.EndReached) {
      if (this.cursor.Iterator.CurrentVoiceEntries) {
        this.scheduler.loadNotes(this.cursor.Iterator.CurrentVoiceEntries);
      }
      this.cursor.next();
      ++steps;
    }
    this.iterationSteps = steps;
    this.cursor.reset();
  }

  getNoteDuration(note) {
    let duration = note.Length.RealValue * this.wholeNoteLength;
    if (note.NoteTie) {
      if (Object.is(note.NoteTie.StartNote, note) && note.NoteTie.Notes[1]) {
        duration +=
          note.NoteTie.Notes[1].Length.RealValue * this.wholeNoteLength;
      } else {
        duration = 0;
      }
    }
    return duration;
  }

  iterationCallback() {
    if (this.state !== PlaybackState.PLAYING) return;
    if (this.currentIterationStep > 0) this.cursor.next();
    ++this.currentIterationStep;
  }
  getNoteVolume(note) {
    return note.ParentVoiceEntry.ParentVoice.Volume;
  }

  // vectorMultiplication(point) {
  //   const result = new PointF2D();
  //   result.x = point.x * this.matrix[0][0] + point.y * this.matrix[0][1];
  //   result.y = point.x * this.matrix[1][0] + point.y * this.matrix[1][1];
  //   return result;
  // }

  /**
   * 需要优化!!!
   * 高亮显示特定小节中的音符
   * 参考 https://github.com/opensheetmusicdisplay/opensheetmusicdisplay/wiki/Exploring-the-Demo
   *
   * @param {*} startMeasureNumber
   * @param {*} endMeasureNumber
   * @param {*} hightlightColor
   * @returns
   * @memberof MusicEngine
   */
  setMeasureHighlight(startMeasureNumber, endMeasureNumber, hightlightColor) {
    console.log(this.osmd.graphic);
    if (isNaN(startMeasureNumber) || isNaN(endMeasureNumber)) return;

    var measureList = this.osmd.graphic.measureList;

    // var GraphicSheet = new this.osmd.Graphic()
    // console.log(GraphicSheet);
    // var graphicalMeasures = GraphicSheet.getFirstVisibleMeasuresListFromIndices(1,2)
    // console.log(graphicalMeasures);

    measureList.forEach((item, index) => {
      if (index === startMeasureNumber || index === endMeasureNumber) {
        console.log(index);
        item.forEach((element, idx) => {
          element.staffEntries.forEach((m, mdx) => {
            m.graphicalVoiceEntries[0].notes.forEach((t, tdx) => {
              t.sourceNote.noteheadColor = hightlightColor || "#8A2BE2";

              console.log(
                t.PositionAndShape.DataObject.PositionAndShape.AbsolutePosition
              );
            });

            // m.graphicalVoiceEntries[0].notes[0].sourceNote.noteheadColor = hightlightColor || "#8A2BE2";
          });
        });
      }
    });
  }

  createContainer(id) {
    const wrapper = document.querySelector(".page-wrapper");
    const dom = document.createElement("div");
    dom.id = id;
    wrapper.appendChild(dom);
    return dom;
  }

  /**
   * start,end measure index number
   *
   * @param {*} start number
   * @param {*} end number
   * @memberof MusicEngine
   */
  async sliceMeasure(start, end) {
    const id = `id-${start.toString() + end.toString()}`;
    let container = this.createContainer(id);
    console.log(container);
    this.getInstanceOSMD(container).then(async instance => {
      console.log(instance);
      console.log(this.scoreUrl);

      const scoreXml = await axios.get(this.scoreUrl);
      await instance.load(scoreXml.data);

      instance.setOptions({
        drawFromMeasureNumber: start,
        drawUpToMeasureNumber: end
      });
      instance.render();
    });
  }

  /**
   * BPM是英文Beat Per Minute的简称，中文名称为节拍.
   * 表示：每分钟的节拍数(Tick)
   *
   * @param {*} bpm
   * @memberof MusicEngine
   */
  setBpm(bpm) {
    this.playbackSettings.defaultBpm = bpm;
  }

  async render() {
    if (this.osmd.IsReadyToRender()) {
      this.osmd.render();
      // return new PlaybackScheduler(this.osmd); // bake文件使用
    }
  }

  async play() {
    await this.ac.resume();

    if (
      this.state === PlaybackState.INIT ||
      this.state === PlaybackState.STOPPED
    ) {
      this.cursor.show();
    }

    this.state = PlaybackState.PLAYING;
    this.scheduler.start();
  }
  // 此方法对应 PlaybackScheduler_bake文件，使用方法：去掉bake
  async play_bake() {
    try {
      const player = await this.render();
      player.toggle();
    } catch (err) {
      console.log(err);
    }
  }

  show() {
    this.el.appendChild(this.soundslice.container);
  }

  showCursor() {
    this.cursor.show();
  }
  hideCursor() {
    this.cursor.hide();
  }
  nextCursor() {
    this.cursor.next();
  }
  resetCursor() {
    this.cursor.reset();
  }
  followCursor(state) {
    this.osmd.FollowCursor = state;
  }
  setZoom(zoom) {
    this.osmd.zoom = zoom;
    this.osmd.render();
  }
}
