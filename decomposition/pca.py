import numpy as np
from pyspark.ml.feature import PCA as PCAml
from pyspark.ml.feature import VectorAssembler
from pyspark.ml.linalg import Vectors


# we've got data in the following format: {"subject": subject, "data": data, "sex": sex, "age": age, "group": group})}
class PCA:
    def __init__(self, n_components):
        self.n_components = n_components
        self.model = None
        self.assembler = VectorAssembler(inputCols=["data"], outputCol="data_vector")
        
    
    def fit(self, data):
        # image_shape = data[0]['data'].shape
        # image_data = np.array([image['data'] for image in data])
        data = self.assembler.transform(data)
        
        # data_rdd = image_data.rdd.map(lambda x: (x[0], Vectors.dense(x[1:])))
        # data_df = data_rdd.toDF(["id", "features"])
        pca = PCAml(k=self.n_components, inputCol="data_vector", outputCol="features")
        self.model = pca.fit(data)
    
    def transform(self, data):
        # image_shape = data[0]['data'].shape
        # image_data = [np.reshape(image['data'], (image_shape[0], image_shape[1]*image_shape[2]*image_shape[3])) for image in data]
        data = self.assembler.transform(data)
        transformed_df = self.model.transform(data)
        return transformed_df
