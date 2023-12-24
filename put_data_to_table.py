# Import hive module and connect
from pyhive import hive
conn = hive.Connection(host="localhost", username="hive")
cur = conn.cursor()
query = "INSERT INTO neuro.metadata VALUES (102109, '102109', 'F'), (102614, '102614', 'M')"
cur.execute(query)