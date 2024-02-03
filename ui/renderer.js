const createButton = document.getElementById('create-button');
const deleteButton = document.getElementById('delete-button');
let buttonCount = 0;

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

function makeDraggable(button) {
  let isDragging = false;
  let offsetX, offsetY;

  button.addEventListener('pointerdown', (event) => {
    isDragging = true;
    offsetX = event.clientX - button.getBoundingClientRect().left;
    offsetY = event.clientY - button.getBoundingClientRect().top;
    event.preventDefault();
  });

  button.addEventListener('dblclick', () => {
    console.log('Button double clicked');
  });

  document.addEventListener('pointermove', (event) => {
    if (isDragging) {
      button.style.left = `${event.clientX - offsetX}px`;
      button.style.top = `${event.clientY - offsetY}px`;
    }
  });

  document.addEventListener('pointerup', () => {
    isDragging = false;
  });
}

// Make the initial button draggable
makeDraggable(document.getElementById('draggable-button'));