from load_data.load_data import LoadData
from decopmposition.pca import PCA
from training_strategy_configuration.strategy_configuration import GridSearch

class Pipeline:
    def __init__(self, config_path):
        self.config_path = config_path

    def run(self):
        load_data = LoadData(self.config_path)
        data = load_data.load_data()
        
        pca = PCA(self.config_path)
        pca.fit(data)
        transformed_data = pca.transform(data)

        grid_search = GridSearch(transformed_data, self.config_path)
        result, train_data, test_data, validation_data = grid_search.run(transformed_data)
        
        