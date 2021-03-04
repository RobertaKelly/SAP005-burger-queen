import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export const Menu = () => {
  const token = localStorage.getItem("token");
  const [listItems, setItems] = useState([]);
  const [menuHamburgers, setHamburgers] = useState([]);
  const [orderPedidos, setOrderPedidos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [menuCafe, setCafe] = useState([]);
  const [side, setSide] = useState([]);
  const [menuBebidas, setBebidas] = useState([]);
  const [productPrice, setProductPrice] = useState([]);
  const [DeletProduct, setDeletProduct] = useState([]);
  const [total, setTotal] = useState([]);

  const [menu, setMenu] = useState([]);

useEffect(() => {
  fetch("https://lab-api-bq.herokuapp.com/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const itens = data;
      const coffeeItems = itens.filter((products) =>
        products.type.includes("breakfast")
      );
      const burgers = itens.filter((products) =>
        products.sub_type.includes("hamburguer")
      );
      const sideDish = itens.filter((products) =>
        products.sub_type.includes("side")
      );
      const drink = itens.filter((products) =>
        products.sub_type.includes("drinks")
      );
      setBebidas(drink);
      setSide(sideDish);
      setHamburgers(burgers);
      setCafe(coffeeItems);
    })
    .catch((error) => console.log("error", error));
}, []);

const handleAddItems = (product) => {
  const newItems = [...listItems, product]
  setItems(newItems);
  const newProductPrice = [...productPrice, product.price]
  setProductPrice(newProductPrice);
  const addProduct = newItems.map((product) => {
    return {
      id: product.id,
      qtd: 1,
    };
  });
  const requestQtd = addProduct.reduce(function (x, y) {
    x[y.id] = x[y.id] || [];
    x[y.id].push(y);
    return x;
  }, Object.create(null));

  const list = [];
  for (const [key, value] of Object.entries(requestQtd)) {
    list.push({
      id: key,
      qtd: value.length,
    });
  }

  setOrderPedidos({ ...orderPedidos, products: list });
  console.log(orderPedidos);
};

const handleTotalItems = () => {
  setTotal(productPrice.reduce((total, num) => total + num, 0));
}

const handleDelete = (product) => {
  setTotal(productPrice.splice(listItems.indexOf(product), 1));
  setDeletProduct(listItems.splice(listItems.indexOf(product), 1));
  handleTotalItems();
}

const submitOrder = () => {
  fetch("https://lab-api-bq.herokuapp.com/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${token}`,
    },
    body: JSON.stringify(orderPedidos),
  })
    .then((response) => {
      response.json()
      .then((data) => console.log(data));
      setOrderPedidos({});
      setItems([]);
      setTotal([]);
      setProductPrice([]);
      setDeletProduct([]);
      alert('Pedido criado com sucesso!')
    })
    .catch((error) => console.log("error", error));
  };

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
      setPedidos(response.filter(pedido => pedido.status =='Pedido pronto'))
       
      })
      .then((data) => {
        console.log(data);
      })

      .catch((error) => console.log("error", error));
  },[]);

  const handleOrder = (orderId) => {
    console.log(orderId)
   fetch(`https://lab-api-bq.herokuapp.com/orders/${orderId}`, {
     method: 'PUT',
     headers: { 
       'accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': `${token}`
     },
     body: JSON.stringify({
         'status': 'Pedido pronto'
     })
   })
   .then((response) => response.json())
   .then((json) => {
     console.log(json)
     const copia = pedidos.filter(pedido => pedido.id != orderId) 
     setPedidos(copia)
   })
 };

  

return (
  <>
  <div className="menu">
    <div className="App">
    <section>
      <div>
        <img src={"../img/logo.png"}/>
      </div>
    </section>
      <button className="buttonMenu" onClick={() => setMenu('breakfast')}>
        Café da manhã
      </button>
      <button className="buttonMenu" onClick={() => setMenu('hamburger')}>
        Hamburguer
      </button>
      <button className="buttonMenu" onClick={() => setMenu('side')}>
        Acompanhamento
      </button>
      <button className="buttonMenu" onClick={() => setMenu('drinks')}>
        Bebidas
      </button>
      <button className="buttonMenu" onClick={() => setMenu('prontos')}>
        Pedidos prontos
      </button>

      {menu === 'breakfast' && (
        <div>
           <table className='itens'>
            <tbody>
              <tr>
                <th>Café da Manhã</th>
                <th>Preço</th>
              </tr>
              {menuCafe.map((produto) => (
                <tr key={produto.id}>
                  <div className="menuProducts">
                    <img src={produto.image} alt={`${produto.name}`} />
                  </div>
                  <td>{produto.name}</td>
                  <td>R$ {produto.price},00</td>
                  <td>
                    <button onClick={() => handleAddItems(produto)}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {menu === 'hamburger' && (
        <div>
           <table className='itens'>
            <tbody>
              <tr>
                <th>Hambúrgueres</th>
                <th>Adicionais</th>
                <th>Preço</th>
              </tr>
              {menuHamburgers.map((produto) => (
                <tr key={produto.id}>
                  <div className="menuProducts">
                    <img src={produto.image} alt={`${produto.name} Image`} />
                  </div>
                  <td>{produto.name + ' ' + produto.flavor}</td>
                  <td>{produto.complement === 'null' ? '' : produto.complement}</td>
                  <td>R$ {produto.price},00</td>
                  <td>
                    <button onClick={() => handleAddItems(produto)}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {menu === 'side' && (
        <div>
           <table className='itens'>
              <tbody>
                <tr>
                  <th>Acompanhamentos</th>
                  <th>Preço</th>
                </tr>
                {side.map((produto) => (
                  <tr key={produto.id}>
                    <div className="menuProducts">
                      <img src={produto.image} alt={`${produto.name}`} />
                    </div>
                    <td>{produto.name}</td>
                    <td>R$ {produto.price},00</td>
                    <td>
                      <button onClick={() => handleAddItems(produto)}>+</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )}

      {menu === 'drinks' && (
        <div>
           <table className='itens'>
            <tbody>
              <tr>
                <th>Bebidas</th>
                <th>Preço</th>
              </tr>
              {menuBebidas.map((produto) => (
                <tr key={produto.id}>
                  <div className="menuProducts">
                    <img src={produto.image} alt={`${produto.name}`} />
                  </div>
                  <td>{produto.name}</td>
                  <td>R$ {produto.price},00</td>
                  <td>
                    <button onClick={() => handleAddItems(produto)}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {menu === 'prontos' && (
        <div>
          <table className='itens'>
            <tbody>
              <tr>
                <th>Produtos</th>
              </tr>
              {pedidos.map((produto) => {
                const dataUpdated = new Date(produto.updatedAt);
                const dataCreated = new Date(produto.createdAt);
                const diferença = Math.abs(dataUpdated) - dataCreated;
                const minutes = Math.floor(diferença / 1000 / 60);
                return(
                  <tr key={produto.id}>
                    <td>{produto.Products.map((item)=>(
                          <>
                            <td> {item.qtd}</td>
                            <td> {item.name},</td>
                          </>
                        ))}</td> 
                    <td> {minutes} min </td>
                    <td>{produto.client_name}</td>
                    <td>{produto.table}</td>
                    <td> 
                    <button className="pedido" id={produto.id} onClick={(e) => handleOrder(e.target.id)}>Pedido entregue</button> 
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

    <table className='itens'>
                <tbody>
                  <tr>
                    <th>Produtos adicionados</th>
                  </tr>
                  {listItems.map((produto) => (
                    <tr key={produto.id}>
                      <div className="menuProducts">
                        <img src={produto.image} alt={`${produto.name}`} />
                      </div>
                      <td>{produto.name}</td>
                      <td>{produto.complement === "null" ? "" : produto.complement}</td>
                      <td>R$ {produto.price},00</td>
                      <td>
                        <button onClick={() => handleDelete(produto)}>Deletar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

        <label>Name:</label><br/>
        <input 
          name="name"
          type="text"
          onChange={(e) => setOrderPedidos({ ...orderPedidos, client: e.target.value })}
        /><br/>
        <label>Numero da mesa:</label><br/>
        <input
          name="table"
          type="text"
          onChange={(e) => setOrderPedidos({ ...orderPedidos, table: e.target.value })}
        /><br/>
        <div>
          <h3>Total</h3>
          <h3>R${total}</h3>
          <button className="form-button" onClick={() => handleTotalItems()}>Totalizar itens</button>
          <button className="form-button" onClick={() => submitOrder()}>Finalizar pedido</button>
        </div>
        <Link className="link-home" to="/">
          Sair
        </Link>
    </div>
    </>
  );
}
export default Menu;
