const { IDLE, PIVOT, SELECTED, ITERATEE, SORTED } = ARRAY_ITEM_STATUS;

class SortAlgorithm {
  constructor(name, { interval, pauseWhen, breakWhen } = {}) {
    this.name = name;
    this.interval = interval;
    this.isPaused = pauseWhen;
    this.shouldBreak = breakWhen;
  }

  swap(arr, a, b) {
    const tmp = arr[a];
    arr[a] = arr[b];
    arr[b] = tmp;

    arr[a].swapWith(arr[b]);
  }

  async delay() {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), this.interval());
    });
  }

  async waitWhile() {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!this.isPaused()) {
          clearInterval(interval);
          resolve();
        }
      }, 1000 / 30);
    });
  }
}

class BubbleSort extends SortAlgorithm {
  constructor(config) {
    super('Bubble Sort', config);
  }

  async sort(arr) {
    for (let i = 0, n = arr.length; i < n - 1; ++i) {
      for (let j = 0; j < n - i - 1; ++j) {
        arr[j].setStatus(ITERATEE);

        if (this.isPaused()) {
          await this.waitWhile();
        }

        await this.delay();

        if (this.shouldBreak()) {
          return;
        }

        if (arr[j].value > arr[j + 1].value) {
          this.swap(arr, j, j + 1);
        }

        arr[j].setStatus(IDLE);
        arr[j + 1].setStatus(IDLE);
      }

      arr[n - i - 1].setStatus(SORTED);
    }

    arr[0].setStatus(SORTED);
  }
}

class QuickSort extends SortAlgorithm {
  constructor(config) {
    super('Quick Sort', config);
    this.hrs = [];
  }

  async sort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
      /* pi is partitioning index, arr[pi] is now
           at right place */
      const pi = await this.partition(arr, low, high);

      arr[pi].setStatus(SORTED);
      arr[low].setStatus(SORTED);
      arr[high].setStatus(SORTED);

      await this.sort(arr, low, pi - 1); // Before pi
      await this.sort(arr, pi + 1, high); // After pi
    }

    this.destroyHorizontalRulers();
  }

  async partition(arr, low, high) {
    // pivot (Element to be placed at right position)
    const pivot = arr[high];
    pivot.setStatus(PIVOT);

    this.destroyHorizontalRulers();
    this.createHorizontalRuler(
      pivot.element.parentElement,
      (pivot.value * 95) / STATE.maxValue + 5
    );

    let i = low - 1; // Index of smaller element and indicates the
    // right position of pivot found so far

    for (let j = low; j <= high - 1; ++j) {
      arr[j].setStatus(ITERATEE);

      if (this.isPaused()) {
        await this.waitWhile();
      }

      await this.delay();

      if (this.shouldBreak()) {
        return;
      }

      // If current element is smaller than the pivot
      if (arr[j].value < pivot.value) {
        arr[j].setStatus(IDLE);

        ++i; // increment index of smaller elemente
        this.swap(arr, i, j);

        arr[i].setStatus(SELECTED);
      } else {
        arr[j].setStatus(IDLE);
      }
    }

    this.swap(arr, i + 1, high);

    return i + 1;
  }

  createHorizontalRuler(container, y) {
    const hr = document.createElement('hr');
    this.hrs.push(hr);

    hr.className = 'horizontal-ruler';
    hr.style.setProperty('top', `${y}%`);
    container.appendChild(hr);
  }

  destroyHorizontalRulers() {
    while (this.hrs.length) {
      this.hrs.pop().remove();
    }
  }
}

class HeapSort extends SortAlgorithm {
  constructor() {
    super('Heap Sort');
  }
}
