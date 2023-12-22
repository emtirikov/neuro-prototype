
import numpy as np

class TrainTestValidationSplit:
    def __init__(self, config):
        self.test_size = config["training_configuration"]["train_test_val_split_params"]["test_size"]
        self.validation_size = config["training_configuration"]["train_test_val_split_params"]["val_size"]
        self.train_size = 1 - self.test_size - self.validation_size
        self.random_state = config["training_configuration"]["train_test_val_split_params"]["random_state"]

    def split(self, image_data):
        n_samples = image_data.shape[0]
        indices = np.arange(n_samples)
        if self.random_state is not None:
            np.random.seed(self.random_state)
            np.random.shuffle(indices)

        train_end = int(self.train_size * n_samples)
        test_end = int((self.train_size + self.test_size) * n_samples)

        train_indices = indices[:train_end]
        test_indices = indices[train_end:test_end]
        validation_indices = indices[test_end:]

        return image_data[train_indices], image_data[test_indices], image_data[validation_indices]
