import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './RoutePlanner.css';

const bouwGoogleMapsUrl = (stops) => {
  const coords = stops.map((stop) => `${stop.breedtegraad},${stop.lengtegraad}`);
  const origin = coords[0];
  const destination = coords[coords.length - 1];
  const tussenstops = coords.slice(1, -1);

  const params = new URLSearchParams({ api: 1, origin, destination, travelmode: 'driving' });
  if (tussenstops.length > 0) {
    params.set('waypoints', tussenstops.join('|'));
  }

  return `https://www.google.com/maps/dir/?${params.toString()}`;
};

const bouwAppleMapsUrl = (stops) => {
  const coords = stops.map((stop) => `${stop.breedtegraad},${stop.lengtegraad}`);
  const bestemmingen = coords.slice(1).join('+to:');
  const params = new URLSearchParams({ saddr: coords[0], daddr: bestemmingen, dirflg: 'd' });
  return `https://maps.apple.com/?${params.toString()}`;
};

const NAVIGATIE_APPS = [
  { naam: 'Google Maps', bouwUrl: bouwGoogleMapsUrl },
  { naam: 'Apple Maps', bouwUrl: bouwAppleMapsUrl },
];

const RouteStopRij = ({ stop, volgnummer, opVerwijder }) => {
  const sleutel = stop.detailPaginaUrl || stop.naamKunstenaar;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: sleutel });

  const stijl = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <li ref={setNodeRef} style={stijl} className="route-stop-rij">
      <span className="route-stop-handvat" {...attributes} {...listeners} aria-label="Versleep om volgorde te wijzigen">
        ⠿
      </span>
      <span className="route-stop-volgnummer">{volgnummer}</span>
      <span className="route-stop-naam">{stop.naamKunstenaar}</span>
      <button
        type="button"
        className="route-stop-verwijder"
        aria-label={`Verwijder ${stop.naamKunstenaar} uit de route`}
        onClick={() => opVerwijder(stop)}
      >
        ×
      </button>
    </li>
  );
};

export const RoutePlanner = ({
  routeStops,
  routeData,
  routeLaadStatus,
  opVerwijderStop,
  opHerorden,
  opBerekenRoute,
  beschikbareKunstenaars,
  opToevoegenStop,
}) => {
  const sensoren = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const verwerkSleepEinde = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const sleutels = routeStops.map((stop) => stop.detailPaginaUrl || stop.naamKunstenaar);
    const vanIndex = sleutels.indexOf(active.id);
    const naarIndex = sleutels.indexOf(over.id);
    if (vanIndex === -1 || naarIndex === -1) {
      return;
    }

    opHerorden(vanIndex, naarIndex);
  };

  return (
    <div className="route-planner">
      {routeStops.length === 0 ? (
        <p className="route-planner-leeg">Je route is nog leeg. Voeg minimaal twee locaties toe om te beginnen.</p>
      ) : (
        <DndContext sensors={sensoren} collisionDetection={closestCenter} onDragEnd={verwerkSleepEinde}>
          <SortableContext
            items={routeStops.map((stop) => stop.detailPaginaUrl || stop.naamKunstenaar)}
            strategy={verticalListSortingStrategy}
          >
            <ol className="route-stop-lijst">
              {routeStops.map((stop, index) => (
                <RouteStopRij
                  key={stop.detailPaginaUrl || stop.naamKunstenaar}
                  stop={stop}
                  volgnummer={index + 1}
                  opVerwijder={opVerwijderStop}
                />
              ))}
            </ol>
          </SortableContext>
        </DndContext>
      )}

      <select
        className="route-toevoeg-keuze"
        value=""
        onChange={(event) => {
          const sleutel = event.target.value;
          if (!sleutel) return;
          const kaartPunt = beschikbareKunstenaars.find((k) => (k.detailPaginaUrl || k.naamKunstenaar) === sleutel);
          if (kaartPunt) {
            opToevoegenStop(kaartPunt);
          }
        }}
        disabled={beschikbareKunstenaars.length === 0}
      >
        <option value="">
          {beschikbareKunstenaars.length === 0 ? 'Alle kunstenaars zijn al toegevoegd' : '+ Kunstenaar toevoegen aan route…'}
        </option>
        {beschikbareKunstenaars.map((kaartPunt) => {
          const sleutel = kaartPunt.detailPaginaUrl || kaartPunt.naamKunstenaar;
          return (
            <option key={sleutel} value={sleutel}>
              {kaartPunt.naamKunstenaar}
            </option>
          );
        })}
      </select>

      <div className="route-planner-acties">
        <button
          type="button"
          className="route-bereken-knop"
          disabled={routeStops.length < 2 || routeLaadStatus === 'laden'}
          onClick={opBerekenRoute}
        >
          {routeLaadStatus === 'laden' ? 'Route wordt berekend…' : 'Route berekenen'}
        </button>
      </div>

      {routeLaadStatus === 'fout' && (
        <p className="route-planner-fout">Route kon niet worden berekend, probeer het opnieuw.</p>
      )}

      {routeLaadStatus === 'klaar' && routeData && (
        <>
          <details className="route-app-keuze">
            <summary className="route-app-keuze-knop">Openen in app</summary>
            <div className="route-app-keuze-menu">
              {NAVIGATIE_APPS.map(({ naam, bouwUrl }) => (
                <a key={naam} href={bouwUrl(routeStops)} target="_blank" rel="noopener noreferrer">
                  {naam} ↗
                </a>
              ))}
            </div>
          </details>
        </>
      )}
    </div>
  );
};
