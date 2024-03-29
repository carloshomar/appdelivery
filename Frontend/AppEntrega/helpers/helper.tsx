import * as Location from "expo-location";

const calculateNewCoordinates = async (
  latitude: number,
  longitude: number,
  distance: number
) => {
  const earthRadius = 6371000;

  // Introduza aleatoriedade nas coordenadas
  const randomFactor = Math.random() * 0.01; // Ajuste o valor conforme necessário

  const lat1 = (latitude + randomFactor) * (Math.PI / 180);
  const lon1 = (longitude + randomFactor) * (Math.PI / 180);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distance / earthRadius) +
      Math.cos(lat1) * Math.sin(distance / earthRadius) * Math.cos(0)
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(0) * Math.sin(distance / earthRadius) * Math.cos(lat1),
      Math.cos(distance / earthRadius) - Math.sin(lat1) * Math.sin(lat2)
    );

  const newLatitude = lat2 * (180 / Math.PI);
  const newLongitude = lon2 * (180 / Math.PI);

  return {
    latitude: newLatitude,
    longitude: newLongitude,
    distance: distance,
  };
};

const deg2rad = (deg: any) => {
  return deg * (Math.PI / 180);
};

const haversineDistancia = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371; // Raio da Terra em quilômetros
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distancia = R * c; // Distância em quilômetros

  return distancia;
};

const calcularDistancia = async (
  origemLatitude: number,
  origemLongitude: number,
  lat: number,
  long: number
) => {
  try {
    const distancia = await haversineDistancia(
      origemLatitude,
      origemLongitude,
      lat,
      long
    );
    return distancia;
  } catch (error) {
    console.error("Erro ao obter a localização:", error);
    return null;
  }
};

function formatCurrency(value: number): string {
  // Formate o valor como dinheiro brasileiro (BRL)
  try {
    const formattedValue = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

    return formattedValue;
  } catch (e) {
    return "";
  }
}

export default { calculateNewCoordinates, calcularDistancia, formatCurrency };
