import cv2
import numpy as np

def concatenate_images(image_paths, orientation='横'):
  images = [cv2.imread(image_path) for image_path in image_paths]
  if orientation == '横':
    max_dim = max(image.shape[0] for image in images)
    resized_images = [cv2.resize(image, (int(image.shape[1] * max_dim / image.shape[0]), max_dim)) for image in images]
  elif orientation == '縦':
    max_dim = max(image.shape[1] for image in images)
    resized_images = [cv2.resize(image, (max_dim, int(image.shape[0] * max_dim / image.shape[1]))) for image in images]
  else:
    raise ValueError("Invalid orientation. Use '横' or '縦'.")
  concatenated_image = np.concatenate(resized_images, axis=1 if orientation == '横' else 0)
  cv2.imwrite(f'{name}.jpg', concatenated_image)
  return concatenated_image

image_paths = ["",""]
name = "concatenated_image"
def process(x):
  if x == "1":
    concatenate_images(image_paths, orientation='横')
  elif x == "2":
    concatenate_images(image_paths, orientation='縦')
  else:
    process()

while True:
  message = input("横 1\n縦 2")
  process(message)
  if message == "bye":
    break
