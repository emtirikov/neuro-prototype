import subprocess
from hdfs import InsecureClient
from upload_data.upload_data import UploadData
from pyhive import hive


class HumanConnectomeDownloader(UploadData):
    def __init__(self, aspera_path, hdfs_host, hdfs_port, hive_host, hive_port):
        self.aspera_path = aspera_path
        self.client = InsecureClient(f'http://{hdfs_host}:{hdfs_port}', user='hdfs')
        self.install_aspera()
        self.hive_host = hive_host
        self.hive_port = hive_port

    def get_list_of_objects(self, source):
        """
        function to get list of objects from HCP using Aspera Connect
        :param source:
        :return:
        """
        # Use Aspera Connect to download the data
        tmp_path = '/tmp/tmp.nii.gz'
        command = f'aspa -QT -l 100M -P33001 -i {source} {tmp_path}'
        res = subprocess.run(command, shell=True)
        return res

    def install_aspera(self):
        download_command = "curl -O https://d3gcli72yxqn2z.cloudfront.net/connect_latest/v4/bin/ibm-aspera-connect-3.11.2.63-linux-g2.12-64.tar.gz"

        install_command = "tar -zxvf ibm-aspera-connect-3.11.2.63-linux-g2.12-64.tar.gz && bash ibm-aspera-connect-3.11.2.63-linux-g2.12-64.sh"

        subprocess.run(download_command, shell=True)
        subprocess.run(install_command, shell=True)

    def upload_to_db(self, source: dict, table_name: str):
        """
        function to upload data from dict to hive where key is subject id and key is dict with data
        :param source:
        :param table_name:
        :return:
        """
        conn = hive.Connection(host=self.hive_host, port=self.hive_port, database="neuro")
        cursor = conn.cursor()

        # Create a new table
        cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} (id STRING, data MAP<STRING, STRING>)")

        # Insert data into the table
        for key, value in source.items():
            cursor.execute(f"INSERT INTO TABLE {table_name} VALUES ('{key}', '{str(value)}')")

        # Close the connection
        cursor.close()
        conn.close()

    def upload_to_ds(self, source, destination):
        # Use Aspera Connect to download the data
        tmp_path = '/tmp/tmp.nii.gz'
        command = f'aspa -QT -l 100M -P33001 -i {source} {tmp_path}'
        subprocess.run(command, shell=True)
        self.save_to_hdfs(tmp_path, destination)

    def save_to_hdfs(self, local_path, hdfs_path):
        # Save the downloaded data to HDFS
        with open(local_path, 'rb') as file:
            self.client.write(hdfs_path, file)
