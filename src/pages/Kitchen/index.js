import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Kitchen = () => {
  const token = localStorage.getItem("token");
  const [orderPedidos, setPedidos] = useState([]);
  const [orderId, setOrderId] = useState([]);

  useEffect(() => {
    fetch("https://lab-api-bq.herokuapp.com/orders", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        setPedidos(response);
      })
      .then((data) => {
        console.log(data);
      })

      .catch((error) => console.log("error", error));
  },[]);

  const handleDelete = (product) => {
    fetch(
      "https://lab-api-bq.herokuapp.com/orders/"`${orderId}`,
      {
        method: "DELETE",
        path: `${orderId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      },
      []
    )
      .then((response) => response.json())
      .then((data) => {
        const dataId = data;
        const filterId = dataId.filter((products) =>
          products.id.includes("id")
        );
        setOrderId(filterId);
        console.log(data);
      })
      .then((data) => {
        const itens = data;
      }, [])
      .catch((error) => console.log("error", error));
  };

  return (
    <>
      <h1>Pedidos solicitados</h1>
      {orderPedidos.map((product, index) => {
        return (
          <div className="container">
            <div className="card">
              <div className="card-container">
                <li key={index}>
                  <p>{product.client_name}</p>
                   <p>{product.Products.map((item,index2)=>(
                     <>
                     <p> {item.name}</p>
                     <p> {item.qtd}</p>
                     </>
                   ))}</p> 
                  <p>{product.table}</p>
                </li>
              </div>
            </div>
          </div>
        );
      })}
      <Link className="link-home" to="/">
        Sair
      </Link>
    </>
  );
};

export default Kitchen;