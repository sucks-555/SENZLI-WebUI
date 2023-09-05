import os
from dotenv import load_dotenv
load_dotenv(".env")
FOLDER = f"../{os.getenv('FOLDER')}"
IMAGE_FOLDER = os.getenv('IMAGE')
VIDEO_FOLDER = os.getenv('VIDEO')

def start():
  INPUT = input("imageを選択 -> 1\nvideoを選択 -> 2: ")
  if INPUT == "1":
    loop(IMAGE_FOLDER)
  elif INPUT == "2":
    loop(VIDEO_FOLDER)
  else:
    start()

def loop(Type):
  while True:
    Media(Type)

def main(path):
  folder, media, mute_folder = [],[],[]
  dir = os.listdir(path)
  for item in dir:
    if "." in item:
      media.append(item)
    else:
      folder.append(item)
  for index in folder:
    if "#" in index:
      mute_folder.append(index)
  result = {
    "folder": folder,
    "media": media,
    "mute_folder": mute_folder,
  }
  return result

def process_files(folder_path, files, unmute=False):
  for file in files:
    new_name = file.replace("#", "") if unmute else f"#{file}"
    print(f"{'解除' if unmute else '非表示'}処理: {file} -> {new_name}")
    os.rename(os.path.join(folder_path, file), os.path.join(folder_path, new_name))

def Media(Type):
  Main = main(f"{FOLDER}/{Type}")
  print(f"[Type] {Type}")
  process = int(input(
    "0.フォルダ直下のファイルの非表示を解除\n"
    "1.フォルダ直下のファイルを非表示\n"
    "2.フォルダの非表示を解除\n"
    "3.フォルダを非表示\n"
    "4.フォルダ内のファイルの非表示を解除\n"
    "5.フォルダ内のファイルを非表示\n0~5を選択: "
  ))
  if process == 0:
    media = "\n".join([f"[{idx+1}] {file}" for idx, file in enumerate(Main["media"])])
    pic_media = int(input(f"{media}\n選択: "))
    choice_media = Main["media"][pic_media - 1]
    if "#" in choice_media:process_files(f"{FOLDER}/{Type}", [choice_media], True)
    else:print(f"[{pic_media}] {choice_media}は既に表示されています")

  if process == 1:
    media = "\n".join([f"[{idx+1}] {file}" for idx, file in enumerate(Main["media"])])
    pic_media = int(input(f"{media}\n選択: "))
    choice_media = Main["media"][pic_media - 1]
    if "#" in choice_media:print(f"[{pic_media}] {choice_media}は既に非表示です")
    else:process_files(f"{FOLDER}/{Type}", [choice_media])

  if process == 2:
    mute_folder = "\n".join([f"[{idx+1}] {folder}" for idx, folder in enumerate(Main["mute_folder"])])
    pic_folder = int(input(f"{mute_folder}\n選択: "))
    choice_folder = Main["mute_folder"][pic_folder - 1]
    if "#" in choice_folder:process_files(f"{FOLDER}/{Type}", [choice_folder], True)
    else:print(f"[{pic_folder}] {choice_folder}は既に表示されています")

  if process == 3:
    folder = "\n".join([f"[{idx+1}] {folder}" for idx, folder in enumerate(Main["folder"])])
    pic_folder = int(input(f"{folder}\n選択: "))
    choice_folder = Main["folder"][pic_folder - 1]
    if "#" in choice_folder:print(f"[{pic_folder}] {choice_folder}は既に非表示です")
    else:process_files(f"{FOLDER}/{Type}", [choice_folder])

  if process == 4:
    folder = "\n".join([f"[{idx+1}] {folder}" for idx, folder in enumerate(Main["folder"])])
    pic_folder = int(input(f"{folder}\nフォルダーを選択してください: "))
    if 1 <= pic_folder <= len(Main["folder"]):
      choice_folder = Main["folder"][pic_folder - 1]
      folder_path = f"{FOLDER}/{Type}/{choice_folder}"
      folder_files = os.listdir(folder_path)
      mute_files = [f"[{idx+1}] {file}" for idx, file in enumerate(folder_files) if "#" in file]
      mute_file_list = "\n".join(mute_files)
      pic_file = int(input(f"{mute_file_list}\nファイルを選択してください: "))
      if 1 <= pic_file <= len(mute_files):
        choice_file = [file for idx, file in enumerate(folder_files) if "#" in file][pic_file - 1]
        process_files(folder_path, [choice_file], True)
      else:print("無効な選択です")
    else:print("無効な選択です")

  if process == 5:
    folder = "\n".join([f"[{idx+1}] {folder}" for idx, folder in enumerate(Main["folder"])])
    pic_folder = int(input(f"{folder}\nフォルダーを選択してください: "))
    if 1 <= pic_folder <= len(Main["folder"]):
      choice_folder = Main["folder"][pic_folder - 1]
      folder_path = f"{FOLDER}/{Type}/{choice_folder}"
      folder_files = os.listdir(folder_path)
      media_files = [file for file in folder_files if "." in file]
      mute_files = [file for file in folder_files if "#" in file]
      if media_files or mute_files:
        all_files = media_files + mute_files
        all_files_with_index = "\n".join([f"[{idx+1}] {file}" for idx, file in enumerate(all_files)])
        pic_file = int(input(f"{all_files_with_index}\nファイルを選択してください: "))
        if 1 <= pic_file <= len(all_files):
          choice_file = all_files[pic_file - 1]
          if not "#" in choice_file: process_files(folder_path, [choice_file])
          else: print(f"[{pic_file}] {choice_file}は既に表示されています")
        else: print("無効な選択です")
      else: print("ファイルが見つかりませんでした")
    else: print("無効な選択です")
  else:
    print("無効な選択です")
    start()

start()
