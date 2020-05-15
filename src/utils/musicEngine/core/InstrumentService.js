import midiInstruments from "../common/instruments";
import * as Soundfont from "soundfont-player";
import axios from "axios";

// 参考 https://github.com/jimutt/osmd-audio-player
export default class InstrumentService {
  constructor() {
    this.ac = null;
    this.players = new Map(); // 可以设置多播放器
    this.instruments = [];

    this.instruments = midiInstruments.map(i => ({
      midiId: i[0],
      name: i[1],
      loaded: false
    }));
  }
  
  init(audioContext) {
    this.ac = audioContext;
  }

  async loadInstrument(midiInstrumentId) {
    const instrument = this.instruments.find(
      i => i.midiId === midiInstrumentId
    );

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

  play(midiInstrumentId, options) {
    return null;
  }

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
      throw new Error(
        "没有为Midi乐器加载任何soundfont播放器" + midiInstrumentId
      );
  }

  getSoundfontPlayerInstrumentName(midiName) {
    return midiName.toLowerCase().replace(/\s+/g, "_");
  }
}
