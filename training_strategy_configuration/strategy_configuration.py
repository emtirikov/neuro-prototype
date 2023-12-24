
from pyspark.ml.classification import LinearSVC
from xgboost.spark import SparkXGBClassifier
from pyspark.ml.evaluation import BinaryClassificationEvaluator
from pyspark.ml.tuning import ParamGridBuilder, TrainValidationSplit
from training_strategy_configuration.train_test_split import TrainTestValidationSplit
from pyspark.ml.feature import OneHotEncoder, StringIndexer

class GridSearch:
    def __init__(self, config):
        self.config = config

    def fit(self, data):
        pass

    def transform(self, image_data):
        if self.config["training_strategy_configuration"]["model_type"] == "classification":
            column = self.config["training_strategy_configuration"]["model_type"]
            indexer = StringIndexer(inputCol="sex", outputCol="l_index")
            indexer_model = indexer.fit(image_data)
            image_data = indexer_model.transform(image_data)

        if self.config["training_strategy_configuration"]["training_model"] == "svm":
            svm = LinearSVC(labelCol="sex_index")
        elif self.config["training_strategy_configuration"]["training_model"] == "xgboost":
            model = SparkXGBClassifier()

        train_data, test_data, validation_data = TrainTestValidationSplit(self.config).split(image_data)

        param_grid = ParamGridBuilder() \
            .addGrid(svm.regParam, [0.1, 0.01]) \
            .addGrid(svm.maxIter, [10, 100]) \
            .build()

        evaluator = BinaryClassificationEvaluator(labelCol="sex_index")

        tvs = TrainValidationSplit(estimator=svm,
                                   estimatorParamMaps=param_grid,
                                   evaluator=evaluator,
                                   trainRatio=0.8)

        model = tvs.fit(train_data)

        result = evaluator.evaluate(model.transform(test_data))

        return model, result, train_data, test_data, validation_data
