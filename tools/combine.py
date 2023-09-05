from PIL import Image

def combine_images(image_path1, image_path2, output_path, vertical=True):
    image1 = Image.open(image_path1)
    image2 = Image.open(image_path2)
    width, height = image1.size

    if vertical:
        upper_half1 = image1.crop((0, 0, width, height // 2))
        lower_half2 = image2.crop((0, height // 2, width, height))
        combined_image = Image.new('RGB', (width, height))
        combined_image.paste(upper_half1, (0, 0))
        combined_image.paste(lower_half2, (0, height // 2))
    else:
        left_half1 = image1.crop((0, 0, width // 2, height))
        right_half2 = image2.crop((width // 2, 0, width, height))
        combined_image = Image.new('RGB', (width, height))
        combined_image.paste(left_half1, (0, 0))
        combined_image.paste(right_half2, (width // 2, 0))

    combined_image.save(output_path)
    print("Images combined and saved as", output_path)

image_path1 = ''
image_path2 = ''
output_path_vertical = 'combined_vertical.jpg'
output_path_horizontal='combined_horizontal.jpg'

def process(x):
  if x == "1":
    combine_images(image_path1, image_path2, output_path_horizontal, vertical=False)
  elif x == "2":
    combine_images(image_path1, image_path2, output_path_vertical, vertical=True)
  else:
    process()

while True:
  message = input("垂直方向に融合 1\n水平方向に融合 2")
  process(message)
  if message == "bye":
    break
