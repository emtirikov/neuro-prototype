
from pyspark.ml.classification import LinearSVC
from pyspark.ml.evaluation import BinaryClassificationEvaluator
from pyspark.ml.tuning import ParamGridBuilder, TrainValidationSplit
from training_strategy_configuration.train_test_split import TrainTestValidationSplit

class GridSearch:
    def __init__(self, image_data, config):
        self.image_data = image_data
        self.config = config

    def run(self, image_data):
        svm = LinearSVC()

        train_data, test_data, validation_data = TrainTestValidationSplit(self.config).split(image_data)

        param_grid = ParamGridBuilder() \
            .addGrid(svm.regParam, [0.1, 0.01]) \
            .addGrid(svm.maxIter, [10, 100]) \
            .build()

        evaluator = BinaryClassificationEvaluator()

        tvs = TrainValidationSplit(estimator=svm,
                                   estimatorParamMaps=param_grid,
                                   evaluator=evaluator,
                                   trainRatio=0.8)

        model = tvs.fit(train_data)

        result = evaluator.evaluate(model.transform(test_data))

        return result, train_data, test_data, validation_data
