import OsmdUtils from "./common/osmdUtils";

export default class PlaybackScheduler{
  constructor(
    osmd,
    denominator,
    wholeNoteLength,
    audioContext,
    noteSchedulingCallback
  ) {
    this.osmd = osmd;
    this.denominator = denominator;
    this.wholeNoteLength = wholeNoteLength;
    this.audioContext = audioContext;
    this.noteSchedulingCallback = noteSchedulingCallback;
    this.started = false;
    this.playing = false;
    this.done = false;
  }

  start() {
    this.osmd.cursor.show();
    this.started = true;
    this.play();
  }

  play() {
    if (!this.started) return this.start();
    if (this.done) return;
    this.playing = true;
    this.stepRecursive();
  }

  pause() {
    if (this.done) return;
    this.playing = false;
  }

  toggle() {
    if (this.playing) this.pause();
    else this.play();
  }

  end() {
    this.done = true;
    this.playing = false;
    this.osmd.cursor.reset();
    this.osmd.cursor.hide();
  }

  async stepRecursive() {
    var that = this;
    const { cursor } = this.osmd;
    var osmdUtils = new OsmdUtils(this.osmd);
    await that.sleep(osmdUtils.msToSleep(that.osmd));
    if (this.playing) {
      cursor.next();
      if (cursor.iterator.endReached) this.end();
      else await this.stepRecursive();
    }
  }
  async sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
