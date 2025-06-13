import React, { useState } from "react";
import MenuLayout from "../../components/Menu";
import Strings from "../../constants/Strings";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import Step5 from "./Step5";
import localizationModel from "../../services/localization.model";

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

    if (key === "busca" && value.length > 2) {
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

  const consultaCep = async (busca) => {
    try {
      const data = await localizationModel.getLocalization(busca);
      if (!data) {
        return;
      }
      handleChange(data.bairro, "location", "bairro");
      handleChange(data.cep, "location", "cep");
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
            latitude: parseFloat(data?.coords?.latitude ?? 0),
            longitude: parseFloat(data?.coords?.longitude ?? 0),
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
      case 5:
        return <Step5 formData={formData} />;
    }
  };

  return (
    <MenuLayout>
      <div className="ml-4 md:ml-6 lg:ml-8 mb-4">
        <h3 className="text-lg md:text-xl lg:text-2xl font-bold">
          Delivery Avulso
        </h3>
      </div>
      <div className="px-4 md:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderStep()}
          <div className="flex flex-col md:flex-row justify-between mt-6">
            {step < 5 && (
              <button
                type="button"
                className="bg-green-500 text-white py-2 px-4 rounded-md mb-2 md:mb-0"
                onClick={nextStep}
              >
                Próximo
              </button>
            )}

            {step === 5 && (
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-4 rounded-md mb-2 md:mb-0"
              >
                Solicitar Entrega
              </button>
            )}

            {step > 1 && (
              <button
                type="button"
                className="bg-gray-500 text-white py-2 px-4 rounded-md mb-2 md:mb-0 sm:mt-6"
                onClick={prevStep}
              >
                Anterior
              </button>
            )}
          </div>
        </form>
      </div>
    </MenuLayout>
  );
}

export default Delivery;
