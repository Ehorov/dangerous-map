const defaultCenter = {
  lat: -3.745,
  lng: -38.523,
};

export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude: lat, langitude: lng } = pos.coords;
          resolve({ lat, lng });
        },
        () => {
          reject(defaultCenter);
        }
      );
    } else {
      reject(defaultCenter);
    }
  });
};
