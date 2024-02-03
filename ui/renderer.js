const createButton = document.getElementById('create-button');
const deleteButton = document.getElementById('delete-button');
let buttonCount = 0;
let arrowCount = 0;
let lastClickedCircle = null;


createButton.addEventListener('click', () => {
  const newButton = document.createElement('button');
  newButton.id = `draggable-button-${buttonCount++}`;
  newButton.innerText = 'Draggable Button';
  newButton.style.position = 'absolute';
  newButton.style.margin = '25px 0';
  newButton.style.fontSize = '0.9em';
  newButton.style.fontFamily = 'sans-serif';
  newButton.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.15)';
  newButton.style.padding = '10px 20px';
  document.body.appendChild(newButton);
  makeDraggable(newButton);

  const leftCircle = document.createElement('div');
  leftCircle.style.position = 'absolute';
  leftCircle.style.width = '10px';
  leftCircle.style.height = '10px';
  leftCircle.style.backgroundColor = 'red';
  leftCircle.style.borderRadius = '50%';
  leftCircle.style.left = '-5px';
  leftCircle.style.top = '20px';
  leftCircle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (lastClickedCircle) {
      drawLine(lastClickedCircle.parentNode, leftCircle.parentNode);
      lastClickedCircle = null;
    } else {
      lastClickedCircle = leftCircle;
    }
  });
  newButton.appendChild(leftCircle);

  const rightCircle = document.createElement('div');
  rightCircle.style.position = 'absolute';
  rightCircle.style.width = '10px';
  rightCircle.style.height = '10px';
  rightCircle.style.backgroundColor = 'red';
  rightCircle.style.borderRadius = '50%';
  rightCircle.style.right = '-5px';
  rightCircle.style.top = '20px';
  rightCircle.addEventListener('click', (event) => {
    event.stopPropagation();
    if (lastClickedCircle) {
      drawLine(lastClickedCircle.parentNode, rightCircle.parentNode);
      lastClickedCircle = null;
    } else {
      lastClickedCircle = rightCircle;
    }
  });
  newButton.appendChild(rightCircle);
});

// Rest of the code remains the same

deleteButton.addEventListener('click', () => {
  if (buttonCount > 0) {
    const buttonToRemove = document.getElementById(`draggable-button-${--buttonCount}`);
    document.body.removeChild(buttonToRemove);
  }
});

let line = null;

function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener('pointerdown', (event) => {
    isDragging = true;
    offsetX = event.clientX - element.getBoundingClientRect().left;
    offsetY = event.clientY - element.getBoundingClientRect().top;
    event.preventDefault();
  });

  element.addEventListener('pointermove', (event) => {
    if (isDragging) {
      element.style.left = `${event.clientX - offsetX}px`;
      element.style.top = `${event.clientY - offsetY}px`;
      if (element.line && element.line.parentNode) {
        const otherElement = element.line.connectedElements.find(e => e !== element);
        element.line.parentNode.removeChild(element.line);
        if (otherElement) {
          drawLine(element, otherElement);
        }
      }
    }
  });

  document.addEventListener('pointerup', () => {
    isDragging = false;
  });
}

function drawLine(element1, element2) {
  const x1 = element1.offsetLeft + element1.offsetWidth / 2;
  const y1 = element1.offsetTop + element1.offsetHeight / 2;
  const x2 = element2.offsetLeft + element2.offsetWidth / 2;
  const y2 = element2.offsetTop + element2.offsetHeight / 2;
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.height = '2px';
  line.style.width = `${distance}px`;
  line.style.backgroundColor = 'red';
  line.style.transformOrigin = '0 0';
  line.style.transform = `rotate(${angle}deg)`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  document.body.appendChild(line);

  line.connectedElements = [element1, element2];
  element1.line = line;
  element2.line = line;
}

// Rest of the code remains the same