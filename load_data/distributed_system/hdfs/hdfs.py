from load_data.distributed_system.hdfs._nifti import NiftiLoader


class HDFSLoader:
    def __init__(self, hdfs_host, hdfs_port, data_format):
        self.hdfs_host = hdfs_host
        self.hdfs_port = hdfs_port
        self.data_format = data_format
        self.spark = self._create_spark_session()
    
    def _create_spark_session(self):
        conf = SparkConf().setAppName("HDFSLoader")
        sc = SparkContext(conf=conf)
        spark = SparkSession(sc)
        return spark
    
    def load_data(self, hdfs_paths):
        for hdfs_path in hdfs_paths:
            subject = hdfs_path.split("/")[-1]#TODO
            nifti_loader = NiftiLoader(self.hdfs_host, self.hdfs_port, self.spark)
            return {"subject": subject, "data": nifti_loader.load(hdfs_path)}
    
