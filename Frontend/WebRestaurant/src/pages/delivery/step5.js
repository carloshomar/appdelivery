import React from "react";

function Step5({ formData }) {
  const {
    cart = [],
    distance,
    location,
    paymentMethod,
    deliveryValue,
    user,
    establishment,
  } = formData;

  return (
    <div className="">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Resumo do Pedido</h1>

      <div className="mb-4">
        <h2 className="text-md md:text-xl font-semibold mb-2">Entrega:</h2>
        {cart.length > 0 ? (
          <div className=" p-2 rounded-md ">
            <p>
              <strong>Nome:</strong> {cart[0].Name}
            </p>
            <p>
              <strong>Descrição:</strong> {cart[0].Description}
            </p>
            <p>
              <strong>ID do Estabelecimento:</strong> {cart[0].EstablishmentID}
            </p>
            <p>
              <strong>ID:</strong> {cart[0].id}
            </p>
          </div>
        ) : (
          <p>Nenhum item no carrinho.</p>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-md md:text-xl font-semibold mb-2">
          Localização da Retirada
        </h2>
        <div className="p-2  rounded-md ">
          <p>
            {`${location.logradouro}, ${location.numero}, ${location.complemento}, ${location.bairro}, ${location.localidade} - ${location.uf}, CEP: ${location.cep}.`}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-md md:text-xl font-semibold mb-2">
          Localização da Entrega
        </h2>
        <div className="p-2  rounded-md ">
          <p>{establishment.location_string}</p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-md md:text-xl font-semibold mb-2">
          Método de Pagamento
        </h2>
        <div className="p-2  rounded-md ">
          <p>
            <strong>Tipo:</strong> {paymentMethod.type}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-md md:text-xl font-semibold mb-2">Contato</h2>
        <div className="p-2  rounded-md ">
          <p>
            <strong>Telefone:</strong> {user.phone}
          </p>
          <p>
            <strong>Nome:</strong> {user.nome}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-md md:text-xl font-semibold mb-2">
          Valor da Entrega
        </h2>
        <div className="p-2  rounded-md ">
          <p>
            <strong>Valor:</strong> {deliveryValue}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Step5;
