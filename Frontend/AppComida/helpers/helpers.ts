import * as Location from "expo-location";

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

function generateId(length = 36) {
  let result = "";
  let characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function formatPhoneNumber(phoneNumber: string) {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phoneNumber;
}

function removePhoneNumberMask(phoneNumber: string) {
  // Remove todos os caracteres que não são dígitos
  return phoneNumber.replace(/\D/g, "");
}

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

const deg2rad = (deg: any) => {
  return deg * (Math.PI / 180);
};

const getLocationDistance = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.error("Permissão de localização negada");
    return null;
  }

  const localizacaoAtual = await Location.getCurrentPositionAsync({});

  return localizacaoAtual.coords;
};

const calcularDistancia = async (lat: number, long: number) => {
  try {
    const { latitude: origemLatitude, longitude: origemLongitude } =
      await getLocationDistance();

    // Calcular a distância usando a fórmula de Haversine
    const distancia = haversineDistancia(
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

function orderByImage(listaDeObjetos: any) {
  // Separe os objetos com o atributo "Image" dos que não têm
  const objetosComImagem = listaDeObjetos.filter((objeto: any) => objeto.Image);
  const objetosSemImagem = listaDeObjetos.filter(
    (objeto: any) => !objeto.Image
  );

  // Classifique os objetos com imagem primeiro
  objetosComImagem.sort((a: any, b: any) => {
    // Aqui você pode personalizar a lógica de ordenação, se necessário
    // Neste exemplo, estamos apenas priorizando os objetos com "Image"
    return a.Image.localeCompare(b.Image);
  });

  // Junte os objetos classificados e retorne a lista ordenada
  return [...objetosComImagem, ...objetosSemImagem];
}

const genCode = (str: string, multiplicar: number | null) => {
  const numerosEncontrados = str.match(/\d+/g);

  if (!numerosEncontrados) {
    return "0000";
  }

  let codigo = numerosEncontrados.slice(0, 4).join("").slice(0, 4);

  if (multiplicar) {
    if (multiplicar === 1) {
      multiplicar = 2;
    }
    codigo = (parseInt(codigo, 10) * multiplicar).toString().slice(0, 4);
  }

  return codigo;
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

export default {
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  removePhoneNumberMask,
  generateId,
  genCode,
  calcularDistancia,
  orderByImage,
  getLocationDistance,
};
