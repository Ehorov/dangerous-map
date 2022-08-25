import React from 'react';
import { GoogleMap, MarkerClusterer } from '@react-google-maps/api';

import s from './Map.module.css';
import { defaultTheme } from './Theme';
import { CurrentLocationMarker } from '../CurrentLocationMarker';
import { Marker } from '../Marker';

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
        console.log({ lat, lng });
        onMarkerAdd({ lat, lng });
      }
    },
    [mode, onMarkerAdd],
  );
  const options = {
    radius: 25,
    zoom: 10,
  };
  function createKey(marker) {
    return marker.lat + marker.lng;
  }

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
        <CurrentLocationMarker position={center} />

        <MarkerClusterer options={options}>
          {clusterer =>
            markers.map(marker => (
              <Marker
                key={createKey(marker)}
                position={marker}
                clusterer={clusterer}
              />
            ))
          }
        </MarkerClusterer>
      </GoogleMap>
    </div>
  );
};

export { Map };
