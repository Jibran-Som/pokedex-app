import React, { useEffect, useState } from 'react';

function MainSection(){
      const [pokemons, setPokemons] = useState([]);

    function PokemonFromBackend(){

        fetch('http://127.0.0.1:5000/pokemon', {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        },
        })

        .then(response => response.json())
        .then(data => {
            setPokemons(data); 
        })
        .catch(err => {
            console.error("Failed to fetch pokemon:", err);
        });
        
    }

    useEffect(() => {
        PokemonFromBackend();
    }, []);

    return (
        <div>
        <h2>Pokémon List</h2>
        <table>
            <tr>
                <th>
                    Avatar
                </th>
                <th>
                    Name
                </th>
            </tr>
            {pokemons.map((pokemon) => (
            <tr key={pokemon._id}>
                <td>
                    <img src={pokemon.avatar} alt={pokemon.name} style={{width: '100px', height: '100px'}} />
                </td>
                <td>
                    <a>{pokemon.name}</a>
                </td>
            </tr>
            ))}
        </table>
        </div>
    );
}

export default MainSection;
