from abc import ABC, abstractmethod

class Database(ABC):

    @abstractmethod
    def load_data(self, query: str) -> dict:
        """
        function to load data from distributed system
        :param query: path to data in distributed system
        :return:
        data: dictionary of data where key is subject id and value is data
        """
        pass
