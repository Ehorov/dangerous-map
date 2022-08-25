import { Marker } from "@react-google-maps/api";

export const CurrentLocationMarker = ({ position }) => {
  return (
    <Marker
      position={position}
      icon={{ url: "/defender.svg" }}
      label={{ text: "You are here", color: "red" }}
    />
  );
};
