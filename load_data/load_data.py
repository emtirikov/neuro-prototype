from utils.utils import ConfigReader
from load_data.distributed_system.hdfs.hdfs import HDFSLoader
from load_data.distributed_system.load_from_distributed_system import DistributedSystem
from load_data.database.hbase import HBaseLoader

class LoadData():
    def __init__(self, 
                 config_path):
        self.config = ConfigReader(config_path).get_config()
        self.dist_system = DistributedSystem(self.config)

    def load_data(self):
        #TODO: load data from distributed system
        if self.config["load_data"]["storage_type"] == "hdfs":
            loader = HDFSLoader(self.config["load_data"]["hdfs_host"], self.config["load_data"]["hdfs_port"])
            image_data = loader.load_data(self.config["load_data"]["hdfs_path"], self.config["load_data"]["data_format"])
        if self.config["load_data"]["database_type"] == "hbase":
            loader = HBaseLoader(self.config["load_data"]["hbase_host"], self.config["load_data"]["hbase_port"])
            meta_data = loader.load_data(self.config["load_data"]["hbase_table"])

        for image in image_data:
            meta_data[image["image_id"]]["data"] = image["data"]
        
        return meta_data
        



