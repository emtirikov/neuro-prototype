import happybase

class HBaseLoader:
    def __init__(self, host, table_name):
        self.connection = happybase.Connection(host)
        self.table = self.connection.table(table_name)

    def get_row(self, row_key):
        return self.table.row(row_key)

    # write a function that returns all the rows in the table in json format
    # format should be like this: {'data': [data], 'subject': subject, 'sex':sex, 'age':age, 'group':group}
    def scan_rows(self, start_row=None, end_row=None, row_prefix=None, limit=None):
        rows = self.table.scan(row_start=start_row, row_stop=end_row, row_prefix=row_prefix, limit=limit)
        for row in rows:
            yield row    
