// 演奏法
export class ArticulationStyle{
  // constructor(){
  //   this.None = "None";
  //   this.Staccato = "Staccato";
  //   this.Legato = "Legato";
  // }
  static None = "None";
  static Staccato = "Staccato";
  static Legato = "Legato";
  static Spiccato = "Spiccato";
}

export class NotePlaybackStyle{
  static articulation = ArticulationStyle.None;
}

export class NotePlaybackInstruction extends NotePlaybackStyle{
  static note = null;
  static gain = null;
  static duration = null;
}
