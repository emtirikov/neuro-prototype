
import numpy as np

class TrainTestValidationSplit:
    def __init__(self, config):
        self.test_size = config["training_strategy_configuration"]["train_test_val_split_params"]["test_size"]
        self.validation_size = config["training_strategy_configuration"]["train_test_val_split_params"]["val_size"]
        self.train_size = 1 - self.test_size - self.validation_size
        self.random_state = config["training_strategy_configuration"]["train_test_val_split_params"]["random_state"]

    def split(self, image_data):
        #TODO add split by some value
        train_data, test_data, validation_data = image_data.randomSplit([self.train_size, self.test_size, self.validation_size], self.random_state)
        return train_data, test_data, validation_data
