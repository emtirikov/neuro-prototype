# from utils.utils import ConfigReader
from load_data.distributed_system.hdfs.hdfs import HDFSLoader
# from load_data.distributed_system.load_from_distributed_system import DistributedSystem
from load_data.database.hive_reader import HiveReader

class LoadData():
    def __init__(self, 
                 config,
                 spark):
        self.config = config
        self.spark = spark
        print(self.config)
        # self.dist_system = DistributedSystem(self.config)

    def load_data(self):
        #TODO: load data from distributed system
        if self.config["load_data"]["storage_type"] == "hdfs":
            loader = HDFSLoader(self.config["load_data"]["storage_params"]["hdfs_host"], self.config["load_data"]["storage_params"]["hdfs_port"], self.spark)
            #TODO return spark dataframe
            image_data = loader.load_data(self.config["load_data"]["storage_params"]["data_path"], self.config["load_data"]["storage_params"]["data_format"])
        
        if self.config["load_data"]["database_type"] == "hive":
            loader = HiveReader(host=self.config["load_data"]["database_params"]["database_host"],
                                port=self.config["load_data"]["database_params"]["database_port"],
                                database=self.config["load_data"]["database_params"]["database_name"])
            #TODO return spark dataframe
            meta_data = loader.get_data(f"select * from {self.config['load_data']['database_params']['table_name']}")

        # if self.config["load_data"]["database_type"] == "hbase":
        #     loader = HiveReader(self.config["load_data"]["hbase_host"], self.config["load_data"]["hbase_port"])
        #     meta_data = loader.load_data(self.config["load_data"]["hbase_table"])

        for image in image_data:
            #TODO merge two dataframes
            meta_data[image["subject"]]["data"] = image["data"].get_fdata()[:,:,:50].ravel()
        
        #TODO return spark dataframe
        return meta_data
        

if __name__ == "__main__":
    path = "../config_user.yaml"
    loader = LoadData(path)
    data = loader.load_data()
    print(len(data))
