import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Pokemon.css';

function Pokemon() {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [moves, setMoves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [movesLoading, setMovesLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('stats');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch Pokémon data
                const pokemonResponse = await fetch(`http://127.0.0.1:5000/pokemon/${id}`);
                if (!pokemonResponse.ok) {
                    throw new Error('Pokémon not found');
                }
                const pokemonData = await pokemonResponse.json();
                setPokemon(pokemonData);
                
                // Fetch moves data if Pokémon has moves
                if (pokemonData.moves && pokemonData.moves.length > 0) {
                    setMovesLoading(true);
                    try {
                        const movesResponse = await fetch(`http://127.0.0.1:5000/pokemon/${id}/moves`);
                        if (movesResponse.ok) {
                            const movesData = await movesResponse.json();
                            // Filter to only include moves that are actually in our database
                            const validMoves = movesData.filter(move => 
                                move && 
                                move.name && 
                                move.type && 
                                move.category
                            );
                            setMoves(validMoves);
                            console.log('Valid moves from database:', validMoves);
                        } else {
                            console.error('Failed to fetch moves');
                        }
                    } catch (movesError) {
                        console.error('Error fetching moves:', movesError);
                    } finally {
                        setMovesLoading(false);
                    }
                }
                
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Function to determine type color
    const getTypeColor = (type) => {
        const typeColors = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };
        
        return typeColors[type.toLowerCase()] || '#68A090';
    };

    // Function to extract category from image URL
    const getCategoryFromUrl = (url) => {
        if (!url || typeof url !== 'string') return 'status';
        
        if (url.includes('physical')) return 'physical';
        if (url.includes('special')) return 'special';
        return 'status';
    };

    // Function to determine category color
    const getCategoryColor = (url) => {
        const category = getCategoryFromUrl(url);
        const categoryColors = {
            physical: '#E44133',
            special: '#3F6FBA',
            status: '#8C888C'
        };
        
        return categoryColors[category] || '#68A090';
    };

    // Function to get category display name
    const getCategoryName = (url) => {
        const category = getCategoryFromUrl(url);
        return category.charAt(0).toUpperCase() + category.slice(1);
    };

    // Function to display value or dashed line if zero
    const displayValue = (value) => {
        return value > 0 ? value : '—';
    };

    if (loading) return (
        <div className="loading-container">
            <div className="pokeball-loading"></div>
            <p>Loading Pokémon data...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/" className="back-link">← Back to Pokémon List</Link>
        </div>
    );
    
    if (!pokemon) return (
        <div className="not-found-container">
            <h2>Pokémon Not Found</h2>
            <p>The Pokémon you're looking for doesn't exist.</p>
            <Link to="/" className="back-link">← Back to Pokémon List</Link>
        </div>
    );

    return (
        <div className="pokemon-detail-container">
            <Link to="/" className="back-link">← Back to Pokémon List</Link>
            
            <div className="pokemon-header">
                <h1 className="pokemon-name">{pokemon.name}</h1>
                <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
            </div>
            
            <div className="pokemon-content">
                <div className="pokemon-image-section">
                    <img src={pokemon.avatar} alt={pokemon.name} className="pokemon-image" />
                    
                    <div className="types-container">
                        <h3>Type(s)</h3>
                        <div className="types-list">
                            {pokemon.types && pokemon.types.map((type, index) => (
                                <span 
                                    key={index} 
                                    className="type-badge"
                                    style={{backgroundColor: getTypeColor(type)}}
                                >
                                    {type}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="pokemon-details-section">
                    <div className="tabs">
                        <button 
                            className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
                            onClick={() => setActiveTab('stats')}
                        >
                            Stats
                        </button>
                        <button 
                            className={`tab ${activeTab === 'moves' ? 'active' : ''}`}
                            onClick={() => setActiveTab('moves')}
                        >
                            Moves {moves.length > 0 && `(${moves.length})`}
                        </button>
                    </div>
                    
                    {activeTab === 'stats' && (
                        <div className="stats-section">
                            <h2>Base Stats</h2>
                            <div className="stats-grid">
                                <div className="stat-row">
                                    <span className="stat-name">HP:</span>
                                    <div className="stat-bar-container">
                                        <div 
                                            className="stat-bar" 
                                            style={{width: `${(pokemon.hp / 255) * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="stat-value">{pokemon.hp}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-name">Attack:</span>
                                    <div className="stat-bar-container">
                                        <div 
                                            className="stat-bar" 
                                            style={{width: `${(pokemon.attack / 255) * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="stat-value">{pokemon.attack}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-name">Defense:</span>
                                    <div className="stat-bar-container">
                                        <div 
                                            className="stat-bar" 
                                            style={{width: `${(pokemon.defense / 255) * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="stat-value">{pokemon.defense}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-name">Sp. Atk:</span>
                                    <div className="stat-bar-container">
                                        <div 
                                            className="stat-bar" 
                                            style={{width: `${(pokemon.sp_attack / 255) * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="stat-value">{pokemon.sp_attack}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-name">Sp. Def:</span>
                                    <div className="stat-bar-container">
                                        <div 
                                            className="stat-bar" 
                                            style={{width: `${(pokemon.sp_defense / 255) * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="stat-value">{pokemon.sp_defense}</span>
                                </div>
                                <div className="stat-row">
                                    <span className="stat-name">Speed:</span>
                                    <div className="stat-bar-container">
                                        <div 
                                            className="stat-bar" 
                                            style={{width: `${(pokemon.speed / 255) * 100}%`}}
                                        ></div>
                                    </div>
                                    <span className="stat-value">{pokemon.speed}</span>
                                </div>
                                <div className="stat-row total-row">
                                    <span className="stat-name">Total:</span>
                                    <span className="stat-value total-value">{pokemon.total}</span>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeTab === 'moves' && (
                        <div className="moves-section">
                            <h2>Moves</h2>
                            {movesLoading ? (
                                <div className="moves-loading">
                                    <p>Loading moves...</p>
                                </div>
                            ) : moves.length > 0 ? (
                                <div>
                                    <p>This Pokémon knows {moves.length} moves from our database:</p>
                                    <div className="moves-grid">
                                        {moves.map((move, index) => (
                                            <div key={index} className="move-card">
                                                <div className="move-header">
                                                    <h3 className="move-name">{move.name}</h3>
                                                    <span 
                                                        className="move-type-badge"
                                                        style={{backgroundColor: getTypeColor(move.type)}}
                                                    >
                                                        {move.type}
                                                    </span>
                                                </div>
                                                <div className="move-details">
                                                    <div className="move-stat">
                                                        <span className="move-stat-label">Category:</span>
                                                        <span 
                                                            className="move-stat-value"
                                                            style={{color: getCategoryColor(move.category)}}
                                                        >
                                                            {getCategoryName(move.category)}
                                                        </span>
                                                    </div>
                                                    <div className="move-stat">
                                                        <span className="move-stat-label">Power:</span>
                                                        <span className="move-stat-value">{displayValue(move.power)}</span>
                                                    </div>
                                                    <div className="move-stat">
                                                        <span className="move-stat-label">Accuracy:</span>
                                                        <span className="move-stat-value">
                                                            {move.accuracy > 0 ? `${move.accuracy}%` : '—'}
                                                        </span>
                                                    </div>
                                                    <div className="move-stat">
                                                        <span className="move-stat-label">PP:</span>
                                                        <span className="move-stat-value">{displayValue(move.pp)}</span>
                                                    </div>
                                                    {move.effect && move.effect.trim() !== '' && (
                                                        <div className="move-effect">
                                                            <span className="move-stat-label">Effect:</span>
                                                            <p className="move-effect-text">{move.effect}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : pokemon.moves && pokemon.moves.length > 0 ? (
                                <div className="no-moves">
                                    <p>This Pokémon has {pokemon.moves.length} moves in its list, but none of them are available in our database.</p>
                                    <p>Move names in Pokémon's list: {pokemon.moves.join(', ')}</p>
                                </div>
                            ) : (
                                <div className="no-moves">
                                    <p>This Pokémon doesn't know any moves.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Pokemon;