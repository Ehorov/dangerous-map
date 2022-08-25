import { Marker as GoogleMapMarker } from "@react-google-maps/api";

export const Marker = ({ position }) => {
  return (
    <GoogleMapMarker position={position} icon={{ url: "/location.svg" }} />
  );
};
