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


@app.route('/pokemon/<pokemon_id>', methods=['GET'])
def get_pokemon(pokemon_id):
    try:
        # Trying to find by MongoDB ObjectId
        try:
            pokemon = pokemon_collection.find_one({'_id': ObjectId(pokemon_id)})
            if pokemon:
                pokemon['_id'] = str(pokemon['_id'])
                return jsonify(pokemon)
        except:
            pass  
        
        pokemon = pokemon_collection.find_one({'id': pokemon_id})
        if pokemon:
            pokemon['_id'] = str(pokemon['_id'])
            return jsonify(pokemon)
        
        if pokemon_id.isdigit():
            pokemon = pokemon_collection.find_one({'id': int(pokemon_id)})
            if pokemon:
                pokemon['_id'] = str(pokemon['_id'])
                return jsonify(pokemon)
        
        pokemon = pokemon_collection.find_one({'$or': [
            {'name': pokemon_id},
            {'name': pokemon_id.capitalize()},
            {'name': pokemon_id.title()},
            {'name': pokemon_id.upper()},
            {'name': pokemon_id.lower()},
            {'name': pokemon_id.replace('-', ' ')},
            {'name': pokemon_id.replace('-', ' ').title()},
            {'name': pokemon_id.replace('-', '').title()}
        ]})
        
        if pokemon:
            pokemon['_id'] = str(pokemon['_id'])
            return jsonify(pokemon)
        else:
            return jsonify({'error': 'Pokémon not found'}), 404
            
    except Exception as e:
        print(f"Error finding Pokémon {pokemon_id}: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

        
@app.route('/moves', methods=['GET'])
def get_all_moves():
    try:
        moves = []
        for move in moves_collection.find():
            move['_id'] = str(move['_id'])
            moves.append(move)
        return jsonify(moves)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/pokemon/<pokemon_id>/moves', methods=['GET'])
def get_pokemon_moves(pokemon_id):
    try:
        pokemon = None
        
        try:
            pokemon = pokemon_collection.find_one({'_id': ObjectId(pokemon_id)})
        except:
            pass  
        
        if not pokemon:
            # First try to find by exact string ID (for Mega Evolutions like "3-mega-venusaur")
            pokemon = pokemon_collection.find_one({'id': pokemon_id})
            
            if not pokemon and '-' in pokemon_id and pokemon_id[0].isdigit():
                # Extract the numeric part from formatted IDs like "3-mega-venusaur"
                base_id_match = re.match(r'^(\d+)', pokemon_id)
                if base_id_match:
                    base_id = int(base_id_match.group(1))
                    pokemon = pokemon_collection.find_one({'id': base_id})
            
            # Trying numeric ID directly
            if not pokemon and pokemon_id.isdigit():
                pokemon = pokemon_collection.find_one({'id': int(pokemon_id)})
            
            if not pokemon:
                pokemon = pokemon_collection.find_one({'$or': [
                    {'name': pokemon_id},
                    {'name': pokemon_id.capitalize()},
                    {'name': pokemon_id.title()},
                    {'name': pokemon_id.replace('-', ' ')},
                    {'name': pokemon_id.replace('-', ' ').title()}
                ]})
        
        if not pokemon:
            return jsonify({'error': 'Pokémon not found'}), 404
        
        # Get moves from the moves collection based on move names
        moves = []
        if 'moves' in pokemon and pokemon['moves']:
            for move_name in pokemon['moves']:
                move = moves_collection.find_one({'name': move_name})
                if move:
                    move['_id'] = str(move['_id'])
                    moves.append(move)
                else:
                    print(f"Move not found in database: {move_name}")
        
        print(f"Found {len(moves)} moves for Pokémon {pokemon.get('name', 'unknown')}")
        return jsonify(moves)
    except Exception as e:
        print(f"Error in get_pokemon_moves: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

