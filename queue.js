function createQueue(ic, init) {
  let that = {};
  let head = 0;
  let tail = 0;
  let length = 0;
  let initialCapacity = ic;
  let currentSize = (typeof initialCapacity === undefined) ? initialCapacity : 200;
  let container = init;
  container.length = currentSize;

  function doubling() {
    let currentSource = head;
    let currentTarget = 0;
    let newContainer = [];
    newContainer.length = 2 * currentSize;

    while (currentTarget < currentSize) {
      newContainer[currentTarget] = container[currentSource];
      currentSource++;
      currentTarget++;
      if (currentSource == currentSize) {
        currentSource = 0;
      }
    }
    container = newContainer;
    head = 0;
    tail = currentSize;
    currentSize *= 2;
  }

  function shrink() {
    let currentSource = head;
    let currentTarget = 0;
    let newContainer = [];
    newContainer.length = currentSize / 4;

    while (currentTarget < currentSize) {
      newContainer[currentTarget] = container[currentSource];
      currentSource++;
      currentTarget++;
      if (currentSource == currentSize) {
        currentSource = 0;
      }
    }
    container = newContainer;
    head = 0;
    tail = currentSize;
    currentSize /= 4;
  }

  that.push = function (element) {
    if (length == currentSize) {
      doubling();
    }
    container[tail] = element;
    length++;
    tail++;
    if (tail == currentSize) {
      tail = 0;
    }
  };

  that.shift = function () {
    if (length === 0) {
      return null;
    }
    tmp = container[head];
    head++;
    length--;
    if (head == currentSize) {
      head = 0;
    }
    if (length == currentSize / 4 && length > initialCapacity) {
      shrink();
    }
    return tmp;
  };


  that.front = function () {
    if (length === 0) {
      return null;
    }
    return container[head];
  };

  that.length = function () {
    return length;
  };

  that.isEmpty = function () {
    return length === 0;
  };

  return that;
}