from load_data.distributed_system.hdfs.hdfs import HDFSLoader

class DistributedSystem:
    def __init__(self, config):
        self.config = config
        if config['load_data']['distributed_system']['type'] == 'hdfs':
            self.loader = HDFSLoader(config)
        else:
            raise NotImplementedError
        
    def load(self):
        return self.loader.load()