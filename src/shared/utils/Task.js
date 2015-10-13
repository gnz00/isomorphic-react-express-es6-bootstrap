import format from './format-time';

class Task {
  constructor(name, fn, args = []) {
    this.name = name;
    this.fn = fn;
    this.start = null;
    this.end = null;
  }

  get elapsed() {
    if (this.end != null && typeof this.end.getTime == "function")
      return this.end.getTime() - this.start.getTime();
    else if (this.start != null && typeof this.start.getTime == "function")
      return (new Date().getTime()) - this.start.getTime();
    else {
      console.log(`Elasped was called on ${this.name}, however, run was never called.`);
    }

  }

  async run() {
    this.start = new Date();
    console.log(`[${format(this.start)}] Starting '${this.name}'...`);
    await this.fn();
    this.end = new Date();
    console.log(`[${format(this.end)}] Finished '${this.name}' after ${this.elapsed} ms`);
    return this.elasped;
  }

}

export default Task;