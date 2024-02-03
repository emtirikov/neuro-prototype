from abc import ABC, abstractmethod

class DistributedSystem(ABC):

    @abstractmethod
    def load_data(self, source_path: str) -> dict:
        """
        function to load data from distributed system
        :param source_path: path to data in distributed system
        :return:
        data: dictionary of data where key is subject id and value is data
        """
        pass
