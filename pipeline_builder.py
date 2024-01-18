from load_data.load_data import LoadData
from decomposition.decomposition import Decomposition
from training_strategy_configuration.strategy_configuration import GridSearch
import numpy as np
from pyspark.sql import SparkSession
from pyspark.context import SparkContext
from pyspark.conf import SparkConf
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, ArrayType, FloatType
from pyspark.ml.linalg import Vectors, VectorUDT
from pyspark.sql.functions import udf
import yaml


class Pipeline:
    def __init__(self, config_path):
        self.config_path = config_path
        self._create_spark_session()
        self._read_config()

    def _read_config(self):
        with open(self.config_path, 'r') as f:
            self.config = yaml.safe_load(f)
        
        
    def _create_spark_session(self):
        conf = SparkConf()
        conf.setAppName("Pipeline")
        conf.setMaster("spark://spark-master:7077")
        conf.set("spark.executor.memory", "10G")
        conf.set("spark.driver.memory", "10G")
        self.spark_context = SparkContext(conf=conf)
        self.spark_session = SparkSession\
            .builder \
            .config(conf=conf) \
            .getOrCreate()

    def run(self):
        
        load_data = LoadData(self.config, self.spark_context)
        data = load_data.load_data()

        decomposition_model = Decomposition(config=self.config)
        decomposition_model.fit(data)
        transformed_data = decomposition_model.transform(data)
        transformed_data.select(transformed_data["features"]).show(truncate=False)

        grid_search = GridSearch(self.config)
        model, result, train_data, test_data, validation_data = grid_search.transform(transformed_data)
        

if __name__ == "__main__":
    pipeline = Pipeline("config_user.yaml")
    pipeline.run()
        