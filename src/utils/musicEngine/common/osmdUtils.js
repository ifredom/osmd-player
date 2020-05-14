export default class OsmdUtils{
  constructor(osmd) {
    this.sheet = osmd.sheet;
    this.cursor = osmd.cursor;
  }

  msToSleep (osmd) {
    const { sheet, cursor } = osmd;
    const beats = this.beatsInCursor(cursor);
    const ms = this.beatsToMs(beats, sheet);
    return parseInt(ms);
  }

  lengthsFromVoices (voices) {
    return voices.reduce(
      (acc, voice) => [
        ...acc,
        ...voice.notes.map(({ length }) => length.realValue)
      ],
      []
    );
  }

  beatsInCursor (cursor) {
    // biggest possible size is the size of the measure itself
    const biggestTime = cursor.iterator.currentMeasure.duration.realValue;

    // now get the smallest duration possible to iretate to next element
    return Math.min(
      biggestTime,
      ...this.lengthsFromVoices(cursor.iterator.currentVoiceEntries)
    );
  }

  bpm (sheet) {
    return sheet.MusicPartManager.MusicSheet.userStartTempoInBPM;
  }

  beatsToMs(beats, sheet) {
    return 1000 * beats * (this.bpm(sheet) / 60);
  }
}
