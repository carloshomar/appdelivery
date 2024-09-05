import React, { useState } from "react";
import MenuLayout from "../../components/Menu";
import Strings from "../../constants/Strings";
import Texts from "../../constants/Texts";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import api from "../../services/api";

function Delivery() {
  const [formData, setFormData] = useState(Strings.orderAvulsa);
  const [item, setItem] = useState([
    {
      ID: "",
      Name: "",
      Description: "",
      Price: "",
      Image: "",
      EstablishmentID: "",
      Categories: "",
      Additional: [],
      quantity: "",
      id: "",
    },
  ]);

  const [step, setStep] = useState(1);

  const handleChange = (e, section, key) => {
    const value = e.target?.value ?? e;

    if (key === "cep" && value.length > 2) {
      consultaCep(value);
    }

    setFormData((prevState) => ({
      ...prevState,
      [section]: {
        ...prevState[section],
        [key]: value,
      },
    }));
  };

  const handleItemChange = (e, key) => {
    const value = e.target.value;
    setItem((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const consultaCep = async (cep) => {
    try {
      const { data } = await api.get(
        `/api/order/localization/get-location?address=${cep}`
      );
      if (!data) {
        return;
      }
      handleChange(data.bairro, "location", "bairro");
      handleChange(data.logradouro, "location", "logradouro");
      handleChange(data.uf, "location", "uf");
      handleChange(data.localidade, "location", "localidade");

      if (data.numero) handleChange(data.numero, "location", "numero");
      if (data.complemento)
        handleChange(data.complemento, "location", "complemento");

      setFormData((prevState) => ({
        ...prevState,
        location: {
          ...prevState.location,
          coords: {
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
          },
        },
      }));
    } catch (e) {
      console.log(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      ...formData,
      cart: [item],
    });
    // Aqui você pode enviar formData para o seu servidor ou processar como necessário
  };

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderStep = () => {
    switch (step) {
      default:
      case 1:
        return <Step1 formData={formData} handleChange={handleChange} />;
      case 2:
        return (
          <Step2
            item={item}
            formData={formData}
            handleChange={handleChange}
            handleItemChange={handleItemChange}
          />
        );
      case 3:
        return <Step3 formData={formData} handleChange={handleChange} />;
      case 4:
        return <Step4 formData={formData} handleChange={handleChange} />;
    }
  };

  return (
    <MenuLayout>
      <div className="ml-6">
        <h3 className="font-bold">Delivery Avulso</h3>{" "}
      </div>
      <div className="">
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          {renderStep()}
          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4"
                onClick={prevStep}
              >
                Anterior
              </button>
            )}
            {step < 4 && (
              <button
                type="button"
                className="bg-green-500 text-white py-2 px-4"
                onClick={nextStep}
              >
                Próximo
              </button>
            )}
            {step === 4 && (
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4"
              >
                Solicitar Entrega
              </button>
            )}
          </div>
        </form>
      </div>
    </MenuLayout>
  );
}

export default Delivery;
