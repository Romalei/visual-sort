class SortAlgorithm {
  constructor(name) {
    this.name = name;
  }

  swap(arr, a, b) {
    const tmp = arr[a];
    arr[a] = arr[b];
    arr[b] = tmp;

    arr[a].swapWith(arr[b]);
  }

  reset(...arrayItems) {
    for (let i = 0; i < arrayItems.length; i++) {
      arrayItems[i].setStatus(ARRAY_ITEM_STATUS.IDLE);
    }
  }

  async delay(time) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), time);
    });
  }

  async waitWhile(isPaused) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!isPaused()) {
          clearInterval(interval);
          resolve();
        }
      }, 1000 / 30);
    });
  }
}

class BubbleSort extends SortAlgorithm {
  constructor() {
    super('Bubble Sort');
  }

  async sort(arr, { interval, pauseWhen: isPaused, breakWhen: shouldBreak }) {
    for (let i = 0, n = arr.length; i < n - 1; ++i) {
      for (let j = 0; j < n - i - 1; ++j) {
        arr[j].setStatus(ARRAY_ITEM_STATUS.ITERATEE);

        if (isPaused()) {
          await this.waitWhile(isPaused);
        }

        await this.delay(interval());

        if (shouldBreak()) {
          return;
        }

        if (arr[j].value > arr[j + 1].value) {
          this.swap(arr, j, j + 1);
        }

        this.reset(arr[j], arr[j + 1]);
      }

      arr[n - i - 1].setStatus(ARRAY_ITEM_STATUS.SORTED);
    }

    arr[0].setStatus(ARRAY_ITEM_STATUS.SORTED);
  }
}

class QuickSort extends SortAlgorithm {
  constructor() {
    super('Quick Sort');
  }
}

class HeapSort extends SortAlgorithm {
  constructor() {
    super('Heap Sort');
  }
}
