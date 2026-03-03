import './app.css';
import { FaSearch } from 'react-icons/fa';  

export const Searchbar = () => (
    <div className='searchbar-wrapper'>
        <input type="text" placeholder='Zoek hier naar een kunstenaar' />
        <button><FaSearch /></button>  
    </div>
);
