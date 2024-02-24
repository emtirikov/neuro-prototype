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

const runButton = document.getElementById('run-button');

runButton.addEventListener('click', () => {
  let config = {};
  const draggableButtons = document.querySelectorAll('[id^="draggable-button-"]');

  draggableButtons.forEach(button => {
    const stage = button.dataset.stage;
    const method = button.dataset.method;
    const params = JSON.parse(button.dataset.params);

    if (!config[stage]) {
      config[stage] = {
        method: method,
        params: {}
      };
    }

    params.forEach(([key, value]) => {
      config[stage].params[key] = value;
    });
  });

    window.electron.writeFile('config_user.json', JSON.stringify(config, null, 2)).then(() => {
      console.log('Configuration file has been successfully generated');
    }).catch((err) => {
      console.error(`Error writing file: ${err}`);
    });
});

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
    console.log("left circle clicked");
    if (lastClickedCircle) {
        console.log("left circle draw");
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
    console.log("right circle clicked");
    if (lastClickedCircle) {
        console.log("right circle draw");
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
    if (buttonToRemove.outLine && buttonToRemove.outLine.parentNode) {
      const otherButton = buttonToRemove.outLine.connectedElements.find[1];
      if (otherButton) {
        otherButton.inLine = null;
      }
      buttonToRemove.outLine.parentNode.removeChild(buttonToRemove.outLine);
    }
    if (buttonToRemove.inLine && buttonToRemove.inLine.parentNode) {
      const otherButton = buttonToRemove.inLine.connectedElements.find[1];
      if (otherButton) {
        otherButton.outLine = null;
      }
      buttonToRemove.inLine.parentNode.removeChild(buttonToRemove.inLine);
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
      if (element.outLine && element.outLine.parentNode) {
        const otherElement = element.outLine.connectedElements[1];
        element.outLine.parentNode.removeChild(element.outLine);
        if (otherElement) {
            otherElement.arrowhead.parentNode.removeChild(otherElement.arrowhead);
            drawArrow(element, otherElement);
        }
     }
      if (element.inLine && element.inLine.parentNode) {
        const otherElement = element.inLine.connectedElements[0];
        element.inLine.parentNode.removeChild(element.inLine);
        element.arrowhead.parentNode.removeChild(element.arrowhead);
        if (otherElement) {
            drawArrow(otherElement, element);
        }
      }
  }});

  element.addEventListener("dblclick", (event) => {
      // const stage = element.dataset.stage;
      // const method = element.dataset.method;
      // const params = JSON.parse(element.dataset.params);
      const stage = "preprocessing";
      const method = "smoothing";
      const params = {"method": "value1"};

      window.electron.send('open-config-window', { stage, method, params, id: element.id });
    });

  document.addEventListener('pointerup', () => {
    isDragging = false;
  });
}

function drawArrow(element1, element2) {
  const leftCircle1 = element1.querySelector('div:last-child');
  const rightCircle2 = element2.querySelector('div');

  const x1 = element1.offsetLeft + leftCircle1.offsetLeft + leftCircle1.offsetWidth / 2;
  const y1 = element1.offsetTop + leftCircle1.offsetTop + leftCircle1.offsetHeight / 2;
  const x2 = element2.offsetLeft + rightCircle2.offsetLeft + rightCircle2.offsetWidth / 2;
  const y2 = element2.offsetTop + rightCircle2.offsetTop + rightCircle2.offsetHeight / 2;

  const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  let line = document.createElement('div');
  line.style.position = 'absolute';
  line.style.height = '2px';
  line.style.width = `${distance}px`;
  line.style.backgroundColor = 'blue';
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
  arrowhead.style.borderBottom = '10px solid blue';
  arrowhead.style.transform = `rotate(${angle}deg)`;
  arrowhead.style.left = `${x2}px`;
  arrowhead.style.top = `${y2}px`;
  document.body.appendChild(arrowhead);

  line.connectedElements = [element1, element2];
  element1.outLine = line;
  element2.inLine = line;
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
async function generateDropDownOptions(selectedStage, selectedMethod=null, selectedParams=null) {
    let data = await readJsonFile('methods.json');
    console.log(data);
    // let stageContent = document.getElementById('stage-content');
    stageContent.innerHTML = '';
    let methodSelection = document.createElement('select');
    methodSelection.id = "method-selection";
    stageContent.appendChild(methodSelection);
    let methodParamsDiv = document.createElement('div');
    methodParamsDiv.id = "method-params";
    stageContent.appendChild(methodParamsDiv);

    for (let [stage_key, stage_value] of data) {
        if (stage_value['stage_name'] === selectedStage) {
            createMethodParamsInput(methodSelection, stage_value['methods']);

            for (let method of stage_value['methods']) {
                let option = document.createElement('option');
                option.value = method["name"];
                option.text = method["name"];
                methodSelection.appendChild(option);
            }
            if (selectedMethod !== null) {
                methodSelection.value = selectedMethod;
                changeMethodParamsInput(methodSelection, selectedParams)
            }
            else {
                methodSelection.value = stage_value['methods'][0]['name'];
                changeMethodParamsInput(methodSelection, [stage_value['methods'][0]]);
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

  element.addEventListener("change", (event) => {
    changeMethodParamsInput(element, methods);
  });
}

function changeMethodParamsInput(element, methods) {
  const methodParamsDiv = document.getElementById('method-params');

    methodParamsDiv.innerHTML = '';
    console.log(33333);
    console.log(methods);
    for (let method of methods) {
      if (method['name'] === element.value) {
        let params = new Map(Object.entries(method['parameters']));
        for (let [param_key, param_value] of params) {
            let input = document.createElement('input');
            input.type = "text";
            input.placeholder = param_key;
            input.value = param_value;
            methodParamsDiv.appendChild(input);
        }
      }
    }
}