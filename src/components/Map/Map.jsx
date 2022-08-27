import React, { useState, useEffect } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';

import s from './Map.module.css';
import { defaultTheme } from './Theme';
import { CurrentLocationMarker } from '../CurrentLocationMarker';
import { Marker } from '../Marker';

import camps from '../data/country.json';
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

  const [selectedCamps, setSelectedCamps] = useState(null);

  useEffect(() => {
    const listener = e => {
      if (e.key === 'Escape') {
        setSelectedCamps(null);
      }
    };
    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <div className={s.container}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={onClick}
        options={defaultOptions}
      >
        {markers.map(marker => (
          <Marker position={marker} icon={'/location.svg'} />
        ))}

        <CurrentLocationMarker position={center} />

        {camps.slice(0, 50).map(camps => (
          <Marker
            key={camps.id}
            position={{
              lat: camps.location.latitude,
              lng: camps.location.longitude,
            }}
            icon={'/places.svg'}
            onClick={() => {
              setSelectedCamps(camps);
            }}
          />
        ))}
        {selectedCamps && (
          <InfoWindow
            position={{
              lat: selectedCamps.location.latitude,
              lng: selectedCamps.location.longitude,
            }}
            onCloseClick={() => {
              setSelectedCamps(null);
            }}
          >
            <div>
              <h2>{selectedCamps.name}</h2>
              <p>{selectedCamps.description}</p>
              <div className={s.copy}>
                <p>{`${selectedCamps.location.latitude}, ${selectedCamps.location.longitude}`}</p>
                <button type={'button'} className={s.btn}>
                  <input type={'image'} alt={'Copy'} src={'/copy.svg'} />
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export { Map };
