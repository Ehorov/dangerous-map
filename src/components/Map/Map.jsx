import React, { useState } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';

import s from './Map.module.css';
import { defaultTheme } from './Theme';
import { CurrentLocationMarker } from '../CurrentLocationMarker';
import { Marker } from '../Marker';
import places from '../data/country.json';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultOptions = {
  panControl: true,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  streetViewControl: false,
  rotateControl: true,
  clickableIcons: false,
  keyboardShortcuts: false,
  scrollwheel: true,
  disableDoubleClickZoom: false,
  fullscreenControl: false,
  styles: defaultTheme,
  minZoom: 3,
  maxZoom: 20,
};

export const MODES = {
  MOVE: 0,
  SET_MARKER: 1,
};

const Map = ({ center, mode, markers, onMarkerAdd }) => {
  const mapRef = React.useRef(undefined);

  const onLoad = React.useCallback(function callback(map) {
    mapRef.current = map;
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    mapRef.current = undefined;
  }, []);

  const onClick = React.useCallback(
    loc => {
      if (mode === MODES.SET_MARKER) {
        const lat = loc.latLng.lat();
        const lng = loc.latLng.lng();

        onMarkerAdd({ lat, lng });
      }
    },
    [mode, onMarkerAdd],
  );

  console.log(places);

  const [selectedPlaces, setSelectedPlaces] = useState(null);

  return (
    <div className={s.container}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={11}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onClick}
        options={defaultOptions}
      >
        {markers.map(marker => (
          <Marker position={marker} />
        ))}

        <CurrentLocationMarker position={center} />

        {places.slice(0, 10).map(places => (
          <Marker
            key={places.id}
            position={{
              lat: places.location.latitude,
              lng: places.location.longitude,
            }}
            onClick={() => {
              setSelectedPlaces(places);
            }}
            icon={{
              url: `/public/m1.png`,
            }}
          />
        ))}
        {selectedPlaces && (
          <InfoWindow
            position={{
              lat: selectedPlaces.location.latitude,
              lng: selectedPlaces.location.longitude,
            }}
          >
            <div>
              <h2>{selectedPlaces.name}</h2>
              <p>{selectedPlaces.description}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export { Map };
