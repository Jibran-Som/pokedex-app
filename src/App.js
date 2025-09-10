import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Homepage from './Homepage';
import Pokemonpage from './Pokemonpage';
import Movespage from './Movepage';


function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/pokemon/:id" element={<Pokemonpage />} />
      <Route path="/moves" element={<Movespage />} />
    </Routes>
  </BrowserRouter>
  );
};  

export default App;