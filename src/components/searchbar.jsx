   const filteredCards = cards.filter((card) =>
    card.title.toLowerCase().includes(search.toLowerCase())
  );
  
  <div className="search-bar">
        <input
          type="text"
          placeholder="Zoek kunstenaar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>