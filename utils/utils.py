import yaml

class ConfigReader:
    def __init__(self, filepath):
        self.filepath = filepath
        self.config = None

    def read_config(self):
        with open(self.filepath, 'r') as f:
            self.config = yaml.safe_load(f)

    def get_config(self):
        if self.config is None:
            self.read_config()
        return self.config
