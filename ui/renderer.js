const createButton = document.getElementById('create-button');
const deleteButton = document.getElementById('delete-button');
const createArrowButton = document.getElementById('create-elements-button');
const deleteArrowButton = document.getElementById('delete-elements-button');
let buttonCount = 0;
let arrowCount = 0;

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
});

deleteButton.addEventListener('click', () => {
  if (buttonCount > 0) {
    const buttonToRemove = document.getElementById(`draggable-button-${--buttonCount}`);
    document.body.removeChild(buttonToRemove);
  }
});

createArrowButton.addEventListener('click', () => {
  const newArrow = document.createElement('div');
  newArrow.id = `draggable-arrow-${arrowCount++}`;
  newArrow.style.position = 'absolute';
  newArrow.style.margin = '25px 0';
  newArrow.style.width = '100px';
  newArrow.style.height = '2px';
  newArrow.style.backgroundColor = 'red';
  document.body.appendChild(newArrow);
  makeDraggable(newArrow);
});

deleteArrowButton.addEventListener('click', () => {
  if (arrowCount > 0) {
    const arrowToRemove = document.getElementById(`draggable-arrow-${--arrowCount}`);
    document.body.removeChild(arrowToRemove);
  }
});

function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener('pointerdown', (event) => {
    isDragging = true;
    offsetX = event.clientX - element.getBoundingClientRect().left;
    offsetY = event.clientY - element.getBoundingClientRect().top;
    event.preventDefault();
  });

  element.addEventListener('dblclick', () => {
    console.log('Element double clicked');
  });

  document.addEventListener('pointermove', (event) => {
    if (isDragging) {
      element.style.left = `${event.clientX - offsetX}px`;
      element.style.top = `${event.clientY - offsetY}px`;
    }
  });

  document.addEventListener('pointerup', () => {
    isDragging = false;
  });
}