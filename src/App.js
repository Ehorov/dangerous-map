import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";

import { Map, MODES } from "./components/Map";
import { Autocomplete } from "./components/Autocomplete";
import { getBrowserLocation } from "./utils/geo";
import s from "./App.module.css";

import { Helmet } from "react-helmet";

const API_KEY = process.env.REACT_APP_API_KEY;

const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};

const libraries = ["places"];

const App = () => {
  const [center, setCenter] = React.useState(defaultCenter);
  const [mode, setMode] = React.useState(MODES.MOVE);
  const [markers, setMarkers] = React.useState([]);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: API_KEY,
    libraries,
  });

  const onPlaceSelect = React.useCallback((coordinates) => {
    setCenter(coordinates);
  }, []);

  const toggleMode = React.useCallback(() => {
    switch (mode) {
      case MODES.MOVE:
        setMode(MODES.SET_MARKER);
        break;
      case MODES.SET_MARKER:
        setMode(MODES.MOVE);
        break;
      default:
        setMode(MODES.MOVE);
    }
    // console.log(mode);
  }, [mode]);

  const onMarkerAdd = React.useCallback(
    (coordinates) => {
      setMarkers([...markers, coordinates]);
    },
    [markers]
  );

  const clear = React.useCallback(() => {
    setMarkers([]);
  }, []);

  React.useEffect(() => {
    getBrowserLocation()
      .then((curLoc) => {
        setCenter(curLoc);
      })
      .catch((defaultLocation) => {
        setCenter(defaultLocation);
      });
  }, []);
  console.log(markers);

  return (
    <div>
      <div className={s.addressSearchContainer}>
        <Autocomplete isLoaded={isLoaded} onSelect={onPlaceSelect} />
        <button className={s.modeToggle} onClick={toggleMode}>
          Set markers
        </button>
        <button className={s.modeToggle} onClick={clear}>
          Clear markers
        </button>
      </div>

      <Helmet>
        <meta charSet="utf-8" />
        <title>World Dangerous Map</title>
        <link rel="canonical" href="https://dangerous-map.vercel.app/" />
        <meta name="description" content="Map" />
      </Helmet>
      {isLoaded ? (
        <Map
          center={center}
          mode={mode}
          markers={markers}
          onMarkerAdd={onMarkerAdd}
        />
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  );
};

export default App;
