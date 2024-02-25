// config.js
const stageSelection = document.getElementById('stage-selection');
const stageContent = document.getElementById('stage-content');
const submitButton = document.getElementById('submit-button');
let draggable_button_id = null;

window.electron.on('init-config', (config) => {
    // TODO: Initialize the form with the passed configuration
    console.log('Initializing config form with:', config);
    draggable_button_id = config.id;
    if (config.stage === null || config.method === null || config.params === null) {
        console.log('Config is not defined');
        generateDropDownOptions("preprocessing")
        return;
    }
    const stage = config.stage;
    const method = config.method;
    const params = config.params;
    // log params type
    console.log(params);
    generateDropDownOptions(stage, method, [params]);
});

document.getElementById('config-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const stage = document.getElementById('stage-selection').value;
    const method = document.getElementById('method-selection').value;
    // const params = {}; // TODO: Get the parameters from the form
    let methodParamsDiv = document.getElementById('method-params');
    let methodParams = new Map();

    for (let i = 0; i < methodParamsDiv.children.length; i++) {
        let childElement = methodParamsDiv.children[i];
        methodParams.set(childElement.placeholder, childElement.value);
    }

    let params = JSON.stringify(Array.from(methodParams.entries()));
    let methodParamsFull = {};
    methodParamsFull["name"] = method;
    methodParamsFull["parameters"] = Object.fromEntries(JSON.parse(params));


    console.log(draggable_button_id);
  window.electron.send('update-config', { stage, method, params: methodParamsFull, id: draggable_button_id});
});

stageSelection.addEventListener('change', () => {
    let selectedStage = stageSelection.value;
    generateDropDownOptions(selectedStage);
});

async function generateDropDownOptions(selectedStage, selectedMethod=null, selectedParams=null) {
    let data = await readJsonFile('methods.json');
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

function createMethodParamsInput(element, methods) {

  element.addEventListener("change", (event) => {
    changeMethodParamsInput(element, methods);
  });
}

function changeMethodParamsInput(element, methods) {
  const methodParamsDiv = document.getElementById('method-params');

    methodParamsDiv.innerHTML = '';
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

function readJsonFile(file_path) {
    return fetch(file_path)
        .then(response => response.json())
        .then(data => {
            return new Map(Object.entries(data));
        })
        .catch(error => console.error(`Error: ${error}`));
}