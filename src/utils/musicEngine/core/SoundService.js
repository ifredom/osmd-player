import midiInstruments from "../common/instruments";
import * as Soundfont from "soundfont-player";
import axios from "axios";

export default class SoundService {
  constructor() {
    this.ac = null;
    this.players = new Map(); // 可以设置多播放器
    this.instruments = [];
    this.buffers = {};

    this.initialize();
  }
  initialize() {
    try {
      // Hack to support AudioContext on iOS
      if (typeof AudioContext !== "undefined") {
        this.ac = new AudioContext();
      } else if (typeof window.webkitAudioContext !== "undefined") {
        this.ac = new window.webkitAudioContext();
      }
      
      
    } catch (e) {
      alert("Web Audio API is not supported in this browser");
    }

    this.loadSounds();

    // set default instrucment
    this.instruments = midiInstruments.map(i => ({
      midiId: i[0],
      name: i[1],
      loaded: false
    }));


  }
  async loadSounds() {
    // load the wav files for each piano key.
    for (let i = 16; i < 65; i++) {
      var soundPath = `/sounds/${i}.wav`;
      this.loadBuffer(i.toString(), soundPath);
    }
  }
  async loadBuffer(name, path) {
    let audioContext = this.ac;
    let buffers = this.buffers;
    var that = this;
    axios({
      method: "get",
      url: path,
      responseType: "arraybuffer"
    }).then(res => {
       // https://developer.mozilla.org/zh-CN/docs/Web/API/AudioContext/decodeAudioData
      audioContext.decodeAudioData(res.data).then((buffer)=>{
        if (!buffer) {
          console.log("解码文件数据时出错: " + path);
          return;
        }
        buffers[name] = buffer;
      })
    });
  }

  async loadInstrument(midiInstrumentId) {
    const instrument = this.instruments.find(i => i.midiId === midiInstrumentId);

    if (!instrument) {
      throw new Error("SoundfontPlayer不支持midi乐器ID " + midiInstrumentId);
    }
    if (this.players.has(midiInstrumentId)) return;

    const player = await Soundfont.instrument(
      this.ac,
      (Soundfont.InstrumentName = this.getSoundfontPlayerInstrumentName(
        instrument.name
      ))
    );
    // 设置播放器的乐器类型
    this.players.set(midiInstrumentId, player);
  }

  // 参考项目： piano-relish-master
  playNote(keyId) {
    
    if (keyId < 16 || keyId > 64) {
      new RangeError("keyId不正确. keyId的有效范围是16到64。");
    }
    
    if (this.buffers.hasOwnProperty(keyId)) {
      let source = this.ac.createBufferSource();
      source.buffer = this.buffers[keyId];
      source.connect(this.ac.destination);
      source.start(0);
    }

  }

  play(midiInstrumentId, options) {}

  stop(midiInstrumentId) {
    if (!this.players.has(midiInstrumentId)) return;
    this.players.get(midiInstrumentId).stop();
  }

  schedule(midiInstrumentId, time, notes) {
    this.verifyPlayerLoaded(midiInstrumentId);
    this.players.get(midiInstrumentId).schedule(time, notes);
  }

  verifyPlayerLoaded(midiInstrumentId) {
    if (!this.players.has(midiInstrumentId))
      throw new Error("没有为Midi乐器加载任何soundfont播放器" + midiInstrumentId);
  }

  getSoundfontPlayerInstrumentName(midiName) {
    return midiName.toLowerCase().replace(/\s+/g, "_");
  }
}
