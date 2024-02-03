
import yaml
from pyspark.sql import SparkSession
from pyspark.context import SparkContext
from pyspark.conf import SparkConf
from upload_data.upload_data import UploadData


class LocalLoader(UploadData):
    def __init__(self, config):
        self.config = config
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

    def upload(self, source, destination):
        """
        function to upload data from local directory to hdfs
        :param source: local directory path
        :param destination: hdfs path
        :return:
        None
        """
        # create a spark session
        spark = SparkSession.builder.appName("UploadData").getOrCreate()
        # read the data from local directory
        data = spark.read.format("binaryFile").option("path", source).load()
        # save the data to hdfs
        data.write.format("binaryFile").option("path", destination).save()
        # stop spark session
        spark.stop()

