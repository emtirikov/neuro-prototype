from pyspark import SparkContext, SparkConf
from pyspark.sql import SparkSession
import nibabel as nib
import io

class NiftiLoader:
    def __init__(self, hdfs_host, hdfs_port, spark):
        self.hdfs_host = hdfs_host
        self.hdfs_port = hdfs_port
        self.spark = spark

    def load(self, hdfs_path):
        file_bytes = self.spark.read.format("binaryFile") \
            .option("path", f"hdfs://{self.hdfs_host}:{self.hdfs_port}/{hdfs_path}") \
            .load() \
            .collect()[0][0]
        file_obj = io.BytesIO(file_bytes)
        return nib.load(file_obj)
