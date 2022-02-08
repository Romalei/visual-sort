const ARRAY_ITEM_STATUS = {
  IDLE: 1,
  ITERATEE: 2,
  SORTED: 3,
  PIVOT: 4,
};

const STATUS_CLASS_MAP = {
  [ARRAY_ITEM_STATUS.IDLE]: [],
  [ARRAY_ITEM_STATUS.ITERATEE]: ['array__item_iteratee'],
  [ARRAY_ITEM_STATUS.SORTED]: ['array__item_sorted'],
  [ARRAY_ITEM_STATUS.PIVOT]: ['array__item_pivot'],
};

class ArrayItem {
  constructor({ value, container, w, h }) {
    this.value = value;
    this.container = container;
    this.status = ARRAY_ITEM_STATUS.IDLE;

    this.init(w, h);
  }

  init(w, h) {
    this.element = document.createElement('div');

    this.element.className = 'array__item';

    this.element.style.setProperty('width', w + '%');
    this.element.style.setProperty('height', h + '%');

    const fontSize = Math.min(w * 2.5, 12);

    if (fontSize >= 8) {
      this.element.innerText = this.value;
      this.element.style.setProperty('font-size', fontSize + 'px');
    }

    this.container.appendChild(this.element);
  }

  markAsSorted() {
    this.setStatus(ARRAY_ITEM_STATUS.SORTED);
  }

  markAsIdle() {
    this.setStatus(ARRAY_ITEM_STATUS.IDLE);
  }

  markAsIteratee() {
    this.setStatus(ARRAY_ITEM_STATUS.ITERATEE);
  }

  markAsPivot() {
    this.setStatus(ARRAY_ITEM_STATUS.PIVOT);
  }

  swapWith(item) {
    const nodeA = this.element;
    const nodeB = item.element;

    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;

    this.container.insertBefore(nodeA, nodeB);
    this.container.insertBefore(nodeB, siblingA);
  }

  setStatus(status) {
    const oldClasses = STATUS_CLASS_MAP[this.status];
    oldClasses.forEach((className) => {
      this.element.classList.remove(className);
    });

    const newClasses = STATUS_CLASS_MAP[status];
    newClasses.forEach((className) => {
      this.element.classList.add(className);
    });

    this.status = status;
  }
}
