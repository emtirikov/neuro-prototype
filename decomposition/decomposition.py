from decomposition.pca import PCA

class Decomposition:
    def __init__(self, config):
        self.config = config
        if self.config["decomposition"]["method"] == "pca":
            self.model = PCA(self.config["decomposition"]["params"]['n_components'])
        else:
            raise NotImplementedError("Decomposition method not supported")

    def fit(self, data):
        self.model.fit(data)
    
    def transform(self, data):
        return self.model.transform(data)