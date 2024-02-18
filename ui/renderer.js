const createButton = document.getElementById('create-button');
const deleteButton = document.getElementById('delete-button');
const firstPart = document.getElementById('first-part');
const stageSelection = document.getElementById('stage-selection');
const stageContent = document.getElementById('stage-content');
let buttonCount = 0;
let lastClickedCircle = null;
let lastClickedDraggableButton = null;
// renderer.js
const downloadButton = document.getElementById('download-button');

downloadButton.addEventListener('click', () => {
  window.electron.send('open-download-window');
});
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
  firstPart.appendChild(newButton);
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
      drawArrow(lastClickedCircle.parentNode, leftCircle.parentNode);
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
      drawArrow(lastClickedCircle.parentNode, rightCircle.parentNode);
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
    if (buttonToRemove.line && buttonToRemove.line.parentNode) {
      const otherButton = buttonToRemove.line.connectedElements.find(e => e !== buttonToRemove);
      if (otherButton) {
        otherButton.line = null;
      }
      buttonToRemove.line.parentNode.removeChild(buttonToRemove.line);
    }
    if (buttonToRemove.arrowhead && buttonToRemove.arrowhead.parentNode) {
      buttonToRemove.arrowhead.parentNode.removeChild(buttonToRemove.arrowhead);
    }
    firstPart.removeChild(buttonToRemove);
  }
});

function makeDraggable(element) {
  let isDragging = false;
  let offsetX, offsetY;

  element.addEventListener('pointerdown', (event) => {
    isDragging = true;
    offsetX = event.clientX - element.getBoundingClientRect().left;
    offsetY = event.clientY - element.getBoundingClientRect().top+10;
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
           if (element.arrowhead && element.arrowhead.parentNode) {
              element.arrowhead.parentNode.removeChild(element.arrowhead);
              drawArrow(otherElement, element);
          }
           else {
             otherElement.arrowhead.parentNode.removeChild(element.arrowhead);
             drawArrow(element, otherElement);
          }
        }
    }
  }});

  element.addEventListener("dblclick", (event) => {
    if (lastClickedDraggableButton === null) {
      lastClickedDraggableButton = element;
    }
    else {
      const stageSelection = document.getElementById('stage-selection');
      lastClickedDraggableButton.dataset.stage = stageSelection.value;
      const methodSelection = document.getElementById('method-selection');
      lastClickedDraggableButton.dataset.method = methodSelection.value;
      let data = readJsonFile('methods.json');
      console.log(data);
      if (element.dataset.stage !== undefined && element.dataset.method !== undefined) {
        stageSelection.value = element.dataset.stage;
        methodSelection.value = element.dataset.method;
      }
      lastClickedDraggableButton = element;
    }

  });

  document.addEventListener('pointerup', () => {
    isDragging = false;
  });
}

function drawArrow(element1, element2) {
  const x1 = element1.offsetLeft + element1.offsetWidth / 2;
  const y1 = element1.offsetTop + element1.offsetHeight / 2;
  const x2 = element2.offsetLeft + element2.offsetWidth / 2;
  const y2 = element2.offsetTop + element2.offsetHeight / 2;
  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  let line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.height = '2px';
  line.style.width = `${distance}px`;
  line.style.backgroundColor = 'red';
  line.style.transformOrigin = '0 0';
  line.style.transform = `rotate(${angle}deg)`;
  line.style.left = `${x1}px`;
  line.style.top = `${y1}px`;
  document.body.appendChild(line);

  let arrowhead = document.createElement('div');
  arrowhead.style.position = 'absolute';
  arrowhead.style.width = '0';
  arrowhead.style.height = '0';
  arrowhead.style.borderLeft = '5px solid transparent';
  arrowhead.style.borderRight = '5px solid transparent';
  arrowhead.style.borderBottom = '10px solid red';
  arrowhead.style.transform = `rotate(${angle}deg)`;
  arrowhead.style.left = `${x2}px`;
  arrowhead.style.top = `${y2}px`;
  document.body.appendChild(arrowhead);

  line.connectedElements = [element1, element2];
  element1.line = line;
  element2.line = line;
  element2.arrowhead = arrowhead;
}
function readJsonFile(file_path) {
    return fetch(file_path)
        .then(response => response.json())
        .then(data => {
            return new Map(Object.entries(data));
        })
        .catch(error => console.error(`Error: ${error}`));
}

//function to generate options for stage selection
async function generateDropDownOptions(selectedStage) {
    let data = await readJsonFile('methods.json');
    // let stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = '';
    let methodSelection = document.createElement('select');
    methodSelection.id = "method-selection";
    createMethodParamsInput(methodSelection, data);
    stageContent.appendChild(methodSelection);
    let methodParamsDiv = document.createElement('div');
    methodParamsDiv.id = "method-params";
    stageContent.appendChild(methodParamsDiv);

    // console.log(data.size);
    for (let [stage_key, stage_value] of data) {
        // console.log(stage_value);
        if (stage_value['stage_name'] === selectedStage) {
          createMethodParamsInput(methodSelection, stage_value['methods']);
            let i = 0;
            for (let method of stage_value['methods']) {
                // console.log(method);
                let option = document.createElement('option');
                option.value = method["name"];
                option.text = method["name"];
                methodSelection.appendChild(option);
                let params = new Map(Object.entries(method['parameters']));
                if (i === 0) {
                    for (let [param_key, param_value] of params) {
                        let input = document.createElement('input');
                        input.type = "text";
                        input.placeholder = param_key;
                        console.log(param_value);
                        methodParamsDiv.appendChild(input);
                    }
                    i++;
                }

            }
        }
    }
}
//function to trigger the generation of options for stage selection
stageSelection.addEventListener('change', () => {
    let selectedStage = stageSelection.value;
    generateDropDownOptions(selectedStage);
});

function createMethodParamsInput(element, methods) {
  const methodParamsDiv = document.getElementById('method-params');

  element.addEventListener("change", (event) => {
    methodParamsDiv.innerHTML = '';
    for (let method of methods) {
      if (method['name'] === element.value) {
        let params = new Map(Object.entries(method['parameters']));
        for (let [param_key, param_value] of params) {
            let input = document.createElement('input');
            input.type = "text";
            input.placeholder = param_key;
            console.log(param_value);
            methodParamsDiv.appendChild(input);
        }
      }
    }
  });
}