import os
from flask import Flask, render_template, request
import json


app = Flask(__name__)

@app.route('/pipeline')
def home():
    return render_template('pipeline_builder.html')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run-pipeline', methods=['POST'])
def run_pipeline():
    data = request.get_json()
    print(data)
    return {'status': 'ok'}

@app.route('/get_string')
def get_string():
    stage_name = request.args.get('stage', None)  # If 'param1' isn't provided, defaults to None
    node_id = request.args.get('node_id', None)  # If 'param2' isn't provided, defaults to None

    result = ''

    with open('static/methods.json', 'r') as f:
        data = json.load(f)
    for stage in data:
        if stage['stage_name'] == stage_name:
            method_selector = f'<select class="method-selector" id="{stage_name}-{node_id}-method-selector" onchange="changeMethod(this, event)">\n'
            inputs = []
            for method in stage['methods']:
                method_name = method['name']
                method_selector += f'<option value="input-box-{stage_name}-{node_id}-{method_name}">{method_name}</option>\n'
                inputs_ = []
                for param in method['parameters']:
                    inputs_.append(f'<input type="text" id="input-{stage_name}-{node_id}-{method_name}-{param}" placeholder="{param}">\n')

                inputs_ = ''.join(inputs_)
                inputs_ = f'<div id="input-box-{stage_name}-{node_id}-{method_name}" style="display:none">{inputs_}</div>'
                inputs.append(inputs_)
            inputs = ''.join(inputs)
            method_selector += '</select>'
            result = f'{method_selector}{inputs}'


    template = f"""
                <div>
                <div class="title-box"><i class="fas fa-mouse"></i> {stage_name}</div>
                  <div class="box dbclickbox" ondblclick="showpopup(event)">
                    Db Click here
                    <div class="modal" style="display:none">
                      <div class="modal-content">
                        <span class="close" onclick="closemodal(event)">&times;</span>
                        {result}
                      </div>

                    </div>
                  </div>
                </div>"""

    # Now you can use these parameters in your function
    return template

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=18080)