
from pyspark.ml.classification import LinearSVC
from pyspark.ml.evaluation import BinaryClassificationEvaluator
from pyspark.ml.tuning import CrossValidator, ParamGridBuilder
from pyspark.sql import SparkSession

class SVM:
    def __init__(self, config, spark):
        self.config = config
        self.spark = spark

    def fit(self, train_data):
        train_data = self.spark.read.format("libsvm").load(self.train_data_path)
        test_data = self.spark.read.format("libsvm").load(self.test_data_path)

        svm = LinearSVC(self.model_params)

        param_grid = ParamGridBuilder() \
            .addGrid(svm.regParam, [0.1, 0.01]) \
            .addGrid(svm.threshold, [0.0, 0.5]) \
            .build()

        evaluator = BinaryClassificationEvaluator()
        cv = CrossValidator(estimator=svm, estimatorParamMaps=param_grid, evaluator=evaluator)

        cv_model = cv.fit(train_data)
        best_model = cv_model.bestModel

        predictions = best_model.transform(test_data)
        auc = evaluator.evaluate(predictions)

        print("AUC score: {}".format(auc))
