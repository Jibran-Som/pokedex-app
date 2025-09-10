import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './MovesSection.css';

function MovesSection() {
    const [moves, setMoves] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchMoves = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://127.0.0.1:5000/moves');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch moves');
                }
                
                const movesData = await response.json();
                setMoves(movesData);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchMoves();
    }, []);

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

    // Function to determine category color
    const getCategoryColor = (category) => {
        const categoryColors = {
            physical: '#E44133',
            special: '#3F6FBA',
            status: '#8C888C'
        };
        
        return categoryColors[category?.toLowerCase()] || '#68A090';
    };

    // Function to extract category from image URL
    const getCategoryFromUrl = (url) => {
        if (!url || typeof url !== 'string') return 'status';
        
        if (url.includes('physical')) return 'physical';
        if (url.includes('special')) return 'special';
        return 'status';
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

    // Filter moves based on selected filters and search term
    const filteredMoves = moves.filter(move => {
        // Filter by type
        const typeMatch = filterType === 'all' || 
                         (move.type && move.type.toLowerCase() === filterType.toLowerCase());
        
        // Filter by category
        const categoryMatch = filterCategory === 'all' || 
                             (move.category && getCategoryFromUrl(move.category).toLowerCase() === filterCategory.toLowerCase());
        
        // Filter by search term
        const searchMatch = searchTerm === '' || 
                           (move.name && move.name.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return typeMatch && categoryMatch && searchMatch;
    });

    // Get unique types for filter dropdown
    const uniqueTypes = [...new Set(moves.map(move => move.type).filter(Boolean))].sort();

    if (loading) return (
        <div className="loading-container">
            <div className="pokeball-loading"></div>
            <p>Loading moves...</p>
        </div>
    );
    
    if (error) return (
        <div className="error-container">
            <h2>Error</h2>
            <p>{error}</p>
            <Link to="/" className="back-link">← Back to Pokémon List</Link>
        </div>
    );

    return (
        <div className="moves-page-container">
            <div className="moves-header">
                <Link to="/" className="back-link">← Back to Pokémon List</Link>
                <h1>Pokémon Moves</h1>
                <p>Total moves: {moves.length}</p>
            </div>

            <div className="filters-container">
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

                <div className="filter-group">
                    <label htmlFor="category-filter">Filter by Category:</label>
                    <select 
                        id="category-filter"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        <option value="physical">Physical</option>
                        <option value="special">Special</option>
                        <option value="status">Status</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="search">Search Moves:</label>
                    <input
                        id="search"
                        type="text"
                        placeholder="Search move names..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="moves-stats">
                <p>Showing {filteredMoves.length} of {moves.length} moves</p>
            </div>

            <div className="moves-grid">
                {filteredMoves.map((move, index) => (
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

            {filteredMoves.length === 0 && (
                <div className="no-moves-found">
                    <p>No moves found matching your filters.</p>
                    <button 
                        onClick={() => {
                            setFilterType('all');
                            setFilterCategory('all');
                            setSearchTerm('');
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}

export default MovesSection;