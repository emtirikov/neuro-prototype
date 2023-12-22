import numpy as np
from pyspark.ml.feature import PCA as PCAml
from pyspark.ml.linalg import Vectors


# we've got data in the following format: {"subject": subject, "data": data, "sex": sex, "age": age, "group": group})}
class PCA:
    def __init__(self, n_components):
        self.n_components = n_components
        self.model = None
    
    def fit(self, data):
        image_shape = data[0]['data'].shape
        image_data = [np.reshape(image['data'], (image_shape[0], image_shape[1]*image_shape[2]*image_shape[3])) for image in data]
        data_rdd = image_data.rdd.map(lambda x: (x[0], Vectors.dense(x[1:])))
        data_df = data_rdd.toDF(["id", "features"])
        pca = PCAml(k=self.n_components, inputCol="features", outputCol="pca_features")
        self.model = pca.fit(data_df)
    
    def transform(self, data):
        image_shape = data[0]['data'].shape
        image_data = [np.reshape(image['data'], (image_shape[0], image_shape[1]*image_shape[2]*image_shape[3])) for image in data]
        
        data_rdd = image_data.rdd.map(lambda x: (x[0], Vectors.dense(x[1:])))
        data_df = data_rdd.toDF(["id", "features"])
        transformed_df = self.model.transform(data_df)
        transformed_rdd = transformed_df.rdd.map(lambda x: [x[0]] + list(x[2]))
        return transformed_rdd.toDF(["id"] + ["pca_" + str(i+1) for i in range(self.k)])
