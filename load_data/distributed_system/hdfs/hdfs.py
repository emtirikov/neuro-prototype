from load_data.distributed_system.hdfs._nifti import NiftiLoader

import nibabel as nib
import io
from pyspark.sql import SparkSession
from pyspark.context import SparkContext
from pyspark.conf import SparkConf

class HDFSLoader:
    def __init__(self, hdfs_host, hdfs_port, spark):
        self.hdfs_host = hdfs_host
        self.hdfs_port = hdfs_port
        self.spark = spark
    
    def load_data(self, hdfs_paths, format):
        for hdfs_path in hdfs_paths:
            subject = hdfs_path.split("/")[-1].split("_")[0] 
            nifti_loader = NiftiLoader(self.hdfs_host, self.hdfs_port, self.spark)
            yield {"subject": subject, "data": nifti_loader.load(hdfs_path)}
    
if __name__ == "__main__":
    loader = HDFSLoader("namenode", 9000)
    data = loader.load_data(["/data/102109_tfMRI_EMOTION_LR.nii.gz"])
    print(list(data)[0]['data'].header)