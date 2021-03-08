type Observer = (remainingSecond: number) => any;

export class Timer {
  private readonly second: number;
  private remainingSecond: number;
  private observers: Observer[] = [];
  private intervalId: number;

  constructor(second: number) {
    if (!Number.isInteger(second)) {
      throw new Error("Argument `second' must be an integer, float given");
    }
    this.second = this.remainingSecond = second;
  }

  start(): void {
    if (this.intervalId != null) {
      throw 'Timer already started';
    }

    this.intervalId = setInterval(() => this.tick(), 1000);
  }

  stop(): void {
    if (this.intervalId == null) {
      throw 'Timer not started';
    }

    clearInterval(this.intervalId);
    this.intervalId = null;
  }

  onTick(callback: Observer): void {
    this.observers.push(callback);
  }

  protected tick(): void {
    this.remainingSecond--;
    this.observers.forEach(observer => {
      observer(this.remainingSecond);
    });

    if (this.remainingSecond <= 0) {
      this.stop();
    }
  }
}
