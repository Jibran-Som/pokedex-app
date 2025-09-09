import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Pokemon from './components/Pokemon';

function Pokemonpage(){
    return(
        <div>
            <Header />
            <Pokemon />
            <Footer />
        </div>
    );
};
export default Pokemonpage;