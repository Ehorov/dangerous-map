import React, { useState, useEffect } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import CopyToClipboard from 'react-copy-to-clipboard';
import s from './Map.module.css';
import { defaultTheme } from './Theme';
import { CurrentLocationMarker } from '../CurrentLocationMarker';
import { Marker } from '../Marker';
// import * as Polygon from '../Polygon/Polygon.jsx';
import { country } from '../data/All.country';

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
  const [copyValue, setCopyValue] = useState('');
  const [copied, setCopied] = useState(false);

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

  const camps = country;
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

        {camps.map(camps => (
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
                <p
                  copyValue={copyValue}
                  onChange={({ target: copyValue }) => setCopyValue(copyValue)}
                >{`${selectedCamps.location.latitude}, ${selectedCamps.location.longitude}`}</p>
                <CopyToClipboard
                  text={`${selectedCamps.location.latitude}, ${selectedCamps.location.longitude}`}
                  onCopy={() => setCopied(true)}
                >
                  <button type={'button'} className={s.btn}>
                    <input type={'image'} alt={'Copy'} src={'/copy.svg'} />
                  </button>
                </CopyToClipboard>
                {copied ? (
                  <span style={{ color: '#33cc99' }}>Copied!</span>
                ) : null}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};

export { Map };
