import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MainSection.css'

function MainSection() {
    const [pokemons, setPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    function PokemonsFromBackend() {
        fetch('http://127.0.0.1:5000/pokemon', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())
        .then(data => {
            setPokemons(data);
            setFilteredPokemons(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Failed to fetch pokemon:", err);
            setError(err.message);
            setLoading(false);
        });
    }

    useEffect(() => {
        PokemonsFromBackend();
    }, []);

    // Filter Pokémon based on search term and type
    useEffect(() => {
        let filtered = pokemons;
        
        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(pokemon => 
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (pokemon.id && pokemon.id.toString().includes(searchTerm))
            );
        }
        
        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(pokemon => 
                pokemon.types && pokemon.types.some(type => 
                    type.toLowerCase() === filterType.toLowerCase()
                )
            );
        }
        
        setFilteredPokemons(filtered);
    }, [searchTerm, filterType, pokemons]);

    // Function to create hexagon points for SVG
    const getHexagonPoints = (stats, maxStat = 255) => {
        const statsArray = [
            stats.hp || 0,
            stats.attack || 0,
            stats.defense || 0,
            stats.sp_attack || 0,
            stats.sp_defense || 0,
            stats.speed || 0
        ];
        
        const points = statsArray.map((stat, index) => {
            const angle = (Math.PI * 2 * index) / 6 - Math.PI / 2;
            const radius = (stat / maxStat) * 40;
            const x = 50 + radius * Math.cos(angle);
            const y = 50 + radius * Math.sin(angle);
            return `${x},${y}`;
        });
        
        return points.join(' ');
    };

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
        
        return typeColors[type?.toLowerCase()] || '#68A090';
    };

    // Get unique types for filter dropdown
    const uniqueTypes = [...new Set(pokemons.flatMap(pokemon => pokemon.types || []))].sort();

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
        </div>
    );

    return (
        <div className="main-section-container">
            <div className="section-header">
                <h2>Pokémon List</h2>
                <Link to="/moves" className="moves-link">View All Moves →</Link>
            </div>

            {/* Search and Filter Controls */}
            <div className="pokemon-filters">
                <div className="filter-group">
                    <label htmlFor="pokemon-search">Search Pokémon:</label>
                    <input
                        id="pokemon-search"
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="filter-group">
                    <label htmlFor="type-filter">Filter by Type:</label>
                    <select 
                        id="type-filter"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="all">All Types</option>
                        {uniqueTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-stats">
                    <p>Showing {filteredPokemons.length} of {pokemons.length} Pokémon</p>
                    {(searchTerm || filterType !== 'all') && (
                        <button 
                            onClick={() => {
                                setSearchTerm('');
                                setFilterType('all');
                            }}
                            className="clear-filters-btn"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            <div className="pokemon-grid">
                {filteredPokemons.map((pokemon) => (
                    <div key={pokemon._id} className="pokemon-card">
                        <div className="pokemon-image">
                            <img src={pokemon.avatar} alt={pokemon.name} />
                        </div>
                        <div className="pokemon-info">
                            <h3 className="pokemon-name">
                                <Link to={`/pokemon/${pokemon.id}`}>{pokemon.name}</Link>
                            </h3>
                            <div className="pokemon-types">
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
                            <div className="stat-hexagon">
                                <svg width="100" height="100" viewBox="0 0 100 100">
                                    {/* Hexagon grid lines */}
                                    <polygon
                                        points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
                                        fill="none"
                                        stroke="#e0e0e0"
                                        strokeWidth="1"
                                    />
                                    <polygon
                                        points="50,20 80,35 80,65 50,80 20,65 20,35"
                                        fill="none"
                                        stroke="#e0e0e0"
                                        strokeWidth="1"
                                    />
                                    <polygon
                                        points="50,35 65,42.5 65,57.5 50,65 35,57.5 35,42.5"
                                        fill="none"
                                        stroke="#e0e0e0"
                                        strokeWidth="1"
                                    />
                                    
                                    {/* Stat hexagon */}
                                    <polygon
                                        points={getHexagonPoints(pokemon)}
                                        fill="rgba(0, 120, 255, 0.3)"
                                        stroke="rgba(0, 120, 255, 0.8)"
                                        strokeWidth="2"
                                    />
                                    
                                    {/* Stat labels */}
                                    <text x="50" y="8" textAnchor="middle" fontSize="6" fill="#666">HP</text>
                                    <text x="88" y="30" textAnchor="middle" fontSize="6" fill="#666">ATK</text>
                                    <text x="88" y="70" textAnchor="middle" fontSize="6" fill="#666">DEF</text>
                                    <text x="50" y="92" textAnchor="middle" fontSize="6" fill="#666">SPA</text>
                                    <text x="12" y="70" textAnchor="middle" fontSize="6" fill="#666">SPD</text>
                                    <text x="12" y="30" textAnchor="middle" fontSize="6" fill="#666">SPE</text>
                                </svg>
                            </div>
                            <div className="pokemon-stats-summary">
                                <span className="total-stat">Total: {pokemon.total}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredPokemons.length === 0 && (
                <div className="no-pokemon-found">
                    <p>No Pokémon found matching your search criteria.</p>
                    <p>Try adjusting your search terms or filters.</p>
                </div>
            )}
        </div>
    );
}

export default MainSection;