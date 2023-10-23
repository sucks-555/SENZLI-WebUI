import os
import json

class Kemono:
  def __init__(self):
    self.load_users_json()

  def load_users_json(self):
    self.users_json = []
    try:
      with open(os.path.join(os.path.dirname(__file__), 'kemono.json'), 'r', encoding='utf-8') as file:
        self.users_json.append(json.load(file))
    except FileNotFoundError:
      print("ERROR: 'kemono.json' not found")
      exit(1)

  def artist(self, user=0):
    artists = self.users_json[0].get("artists", [])
    if 0 <= user < len(artists):
      return artists[user]
    else:
      print("ERROR: Invalid artist index")
      exit(1)

  def artists(self):
    artists = self.users_json[0].get("artists", [])
    artist_data = [{"id": i, "name": artist.get("name")} for i, artist in enumerate(artists)]
    return artist_data

  def create(self, user=0):
    artist = self.artist(user)
    if artist:
      platforms = artist.get("platforms", [])
      artist_ids = artist.get("id", [])
      urls = [f"https://kemono.party/{platform}/user/{artist_id}" for artist_id, platform in zip(artist_ids, platforms)]
      return urls
    else:
      return None

def main():
  kemono = Kemono()
  user_list = kemono.artists()
  while True:
    for i, artist in enumerate(user_list):
      print(f"{i}: {artist['name']}")
    user_input = input("Enter the number of the artist (q to quit): ")
    if user_input == 'q':
      break
    if user_input.isdigit():
      response = int(user_input)
      if 0 <= response < len(user_list):
        selected_artist = user_list[response]
        print(selected_artist["name"])
        urls = kemono.create(response)
        if urls:
          for url in urls:
            print(url)
        else:
          print("No valid artist data.")
      else:
        print("Invalid artist index.")
    else:
      print("Invalid input. Please enter a number or 'q' to quit.")

if __name__ == "__main__":
  main()
