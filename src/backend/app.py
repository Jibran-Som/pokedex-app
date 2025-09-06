from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
import random
import json

app = Flask(__name__)

CORS(app)


client = MongoClient("mongodb://localhost:27017")
db = client['pokemon_db']
pokemon_collection = db['pokemons']
moves_collection = db['pokemon_moves']



@app.route('/pokemon', methods=['GET'])
def get_pokemons():
    pokemons = []
    for pokemon in pokemon_collection.find():
        pokemon['_id'] = str(pokemon['_id'])
        pokemons.append(pokemon)
    return jsonify(pokemons)


if __name__ == '__main__':
    app.run(debug=True)

