from pyhive import hive
from load_data.database.database import Database

class HiveReader(Database):
    def __init__(self, host="localhost", port=10000, database="neuro"):
        self.host = host
        self.port = port
        self.database = database

    def load_data(self, query) -> dict:
        conn = hive.Connection(host=self.host, port=self.port, database=self.database)
        cursor = conn.cursor()
        cursor.execute(query)
        data = cursor.fetchall()
        col_names = [i[0].split(".")[-1] for i in cursor.description]
        result = {}
        for row in data:
            temp = dict(zip(col_names, row))
            temp.pop("id")
            key = temp.pop("subject")
            result[key] = temp
        cursor.close()
        conn.close()
        return result

if __name__=="__main__":
    reader = HiveReader()
    data = reader.load_data("select * from metadata")
    print(data)
