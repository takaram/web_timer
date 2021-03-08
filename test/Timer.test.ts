import {Timer} from '../src/lib/Timer';

describe(Timer, () => {
  let timer: Timer;
  let callback: jest.Mock;

  beforeEach(() => {
    timer = new Timer(10);
    callback = jest.fn();
    timer.onTick(callback);

    jest.useFakeTimers();
  });

  it('does not call onTick listeners before start', () => {
    jest.advanceTimersByTime(1000);
    expect(callback).not.toBeCalled();
  });

  it('does not call onTick listeners right after start', () => {
    timer.start();
    expect(callback).not.toBeCalled();
  });

  it('calls onTick listeners every second', () => {
    timer.start();

    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1);
    expect(callback).lastCalledWith(9);

    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(2);
    expect(callback).lastCalledWith(8);
  });

  it('calls all of onTick listeners on tick', () => {
    const callback2 = jest.fn();
    timer.onTick(callback2);

    timer.start();
    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(1);
    expect(callback2).toBeCalledTimes(1);
  });

  it('stops calling onTick listeners when remaining time is 0', () => {
    timer.start();
    jest.advanceTimersByTime(10000);
    expect(callback).toBeCalledTimes(10);

    jest.advanceTimersByTime(1000);
    expect(callback).toBeCalledTimes(10);
  });

  describe('stop()', () => {
    it('stops calling onTick listeners', () => {
      timer.start();
      jest.advanceTimersByTime(1000);
      timer.stop();
      jest.advanceTimersByTime(1000);
      expect(callback).toBeCalledTimes(1);
    });

    it('preserves remaining time when stopped', () => {
      timer.start();
      jest.advanceTimersByTime(1000);
      expect(callback).lastCalledWith(9);
      timer.stop();

      jest.advanceTimersByTime(1000);
      timer.start();
      jest.advanceTimersByTime(1000);
      expect(callback).lastCalledWith(8);
    })
  });
})
