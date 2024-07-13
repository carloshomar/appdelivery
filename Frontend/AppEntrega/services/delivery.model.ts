import Strings from "@/constants/Strings";
import api from "./api";

async function getLocation({ coords }: any) {
  if (!coords || !coords?.latitude || !coords?.longitude) {
    return [];
  }

  try {
    const { data } = await api.get(
      `/api/delivery/solicitation-orders?latitude=${coords.latitude}&longitude=${coords.longitude}&limitDistance=${Strings.distance_delivery_distance}`
    );

    const marks = data?.map((mak: any) => {
      return {
        id: mak.establishmentId,
        name: mak.establishment.name,
        location_string: mak.establishment.location_string,
        coordinates: {
          latitude: mak.establishment?.lat ?? 0,
          longitude: mak.establishment?.long ?? 0,
        },
        isEstablishment: true,
        valueDelivery: mak.deliveryValue,
        distance: mak.distance,
        order_id: mak.order_id,
      };
    });

    return marks;
  } catch (e) {
    console.log(e);
    return [];
  }
}

export default { getLocation };
