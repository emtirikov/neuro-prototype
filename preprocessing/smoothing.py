
import numpy as np
import nibabel as nib
from pyspark import SparkContext, SparkConf
from scipy import ndimage
from multiprocessing import Pool

class ImageSmoother:
    def __init__(self, sigma, master='local[*]'):
        self.sigma = sigma
        self.master = master
        self.conf = SparkConf().setAppName('ImageSmoother').setMaster(self.master)
        self.sc = SparkContext(conf=self.conf)

    def smooth_image(self, image):
        with Pool(-1) as p:
            smoothed_img = p.apply(self._smoothing, args=(image,))
        return smoothed_img
    
    def _smoothing(self, image_data):
        
        rdd = self.sc.parallelize(image_data["image"].transpose((3, 0, 1, 2)))
        smoothed_rdd = rdd.map(lambda x: ndimage.gaussian_filter(x, sigma=self.sigma))
        
        smoothed_data = np.array(smoothed_rdd.collect()).transpose((1, 2, 3, 0))
        
        # check affine and header
        smoothed_img = nib.Nifti1Image(smoothed_data, image_data.affine, image_data.header)
        image_data["image"] = smoothed_img
        return smoothed_img
        
        # Stop the Spark context
        self.sc.stop()
