import { useAuthApi } from "@/contexts/AuthContext";
import Home from "../pages/home";
import HomeDelivery from "../pages/home_delivery";

function index() {
  const { inWork } = useAuthApi();

  return inWork.status ? <HomeDelivery /> : <Home />;
}
export default index;
