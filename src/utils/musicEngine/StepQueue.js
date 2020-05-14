export default class StepQueue{
  constructor() {
    this.steps = [];
  }
  [Symbol.iterator]() {
    return this.steps.values();
  }

  add(tick, note) {
    const existingStep = this.steps.find(s => s.tick === tick);
    if (existingStep) {
      existingStep.notes.push(note);
    } else {
      this.steps.push({ tick, notes: [note] });
    }
  }

  delete(value) {
    const index = this.steps.findIndex(v => v.tick === value.tick);
    if (index != null) this.steps.splice(index, 1);
  }

  sort() {
    this.steps.sort((a, b) => (a.tick > b.tick ? 1 : 0));
  }
}
