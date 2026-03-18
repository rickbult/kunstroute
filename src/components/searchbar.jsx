   const gefilterdeKaarten = kaarten.filter((kaart) =>
    kaart.title.toLowerCase().includes(zoekterm.toLowerCase())
  );
  
  <div className="zoekbalk">
        <input
          type="text"
          placeholder="Zoek kunstenaar..."
          value={zoekterm}
          onChange={(e) => setZoekterm(e.target.value)}
        />
      </div>