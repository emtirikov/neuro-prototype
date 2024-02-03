from abc import ABC, abstractmethod

class UploadData(ABC):

    @abstractmethod
    def get_list_of_objects(self, source) -> list:
        """
        function to get list of objects from external system
        :param source: path to data in external system

        :return: list of objects
        """
        pass
    @abstractmethod
    def upload_to_ds(self, source: str, destination: str):
        """
        function to upload data from external system to distributed system
        :param source:
        :param destination:
        :return:
        """
        pass
    @abstractmethod
    def upload_to_db(self, source: dict, table_name: str):
        """
        function to upload data from external system to database
        :param source:
        :param table_name:
        :return:
        """
        pass
