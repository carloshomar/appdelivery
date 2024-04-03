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

function formatDate(dataString: string) {
  try {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, "0");
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const ano = data.getFullYear().toString();
    const horas = String(data.getHours()).padStart(2, "0");
    const minutos = String(data.getMinutes()).padStart(2, "0");

    return `${dia}/${mes}/${ano} - ${horas}:${minutos}`;
  } catch (e) {
    console.log(e);

    return dataString;
  }
}

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

function calcularDistanciaMediaDeBike(km: number) {
  // Média de velocidade para ciclistas em km/h
  const mediaVelocidadeBikeKmh = 15;

  // Converter a distância de km para metros
  const distanciaMetros = km * 1000;

  // Calcular o tempo médio em horas (tempo = distância / velocidade)
  const tempoHoras = distanciaMetros / (mediaVelocidadeBikeKmh * 1000);

  // Calcular a distância média em minutos (1 hora = 60 minutos)
  const tempoMinutos = tempoHoras * 60;

  return tempoMinutos;
}

function getMarkerUser(mylocation: any) {
  return {
    id: 999999,
    title: "Usuário",
    coordinates: {
      latitude: mylocation.coords.latitude,
      longitude: mylocation.coords.longitude,
    },
    icon: require("../assets/images/deliveryman_icon.png"),
  };
}

function getMarkerEstablishment(latitude: number, longitude: number) {
  return {
    id: 999998,
    title: "Estabelecimento",
    coordinates: {
      latitude: latitude,
      longitude: longitude,
    },
    icon: require("../assets/images/restaurant_icon.png"),
  };
}

function getMarkerClient(latitude: number, longitude: number) {
  return {
    id: 999997,
    title: "Casa do Cliente",
    coordinates: {
      latitude: latitude,
      longitude: longitude,
    },
    icon: require("../assets/images/house_icon.png"),
  };
}

const formatLocationInfo = (locationInfo: any) => {
  return `${locationInfo.logradouro}, ${locationInfo.numero}, ${
    locationInfo.complemento + locationInfo.complemento ? "," : ""
  } ${locationInfo.bairro}, ${locationInfo.localidade} - ${locationInfo.uf}`;
};

export default {
  getMarkerEstablishment,
  calculateNewCoordinates,
  getMarkerClient,
  calcularDistancia,
  formatLocationInfo,
  formatCurrency,
  getMarkerUser,
  calcularDistanciaMediaDeBike,
  formatDate,
};
