import React, { useEffect, useState } from "react";
import { Table, Card, Image, Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";

import ServiceFire from "../utils/services/ServiceFire";

function Product(props) {
  const [productItems, setProductItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    ServiceFire.getAllProductItems()
      .then((response) => {
        setIsLoading(false);
        setProductItems(response._delegate._snapshot.docChanges);
      })
      .catch((e) => {
        setIsLoading(false);
        alert("Error atrapando los datos del producto " + e);
      });
  }, []);

  return (
    <>
      {isLoading === true && <Spinner animation="border" variant="secondary" />}
      <Card style={{ margin: 24 }}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <div className="align-items-center" style={{ marginRight: 8 }}>
            <Image
              src={
                "https://siamangtec.files.wordpress.com/2022/08/tiendaonline-3.png"
              }
              style={{ width: 150 }}
            />
          </div>
          <Link to="/login">
            <Button style={{ backgroundColor: "#249300", borderWidth: 0 }}>
              Login
            </Button>
          </Link>
        </Card.Header>
        <Card.Body>
          <Table responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Proveedor</th>
                <th>Precio </th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {productItems &&
                productItems.map((productItems, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      {
                        productItems.doc.data.value.mapValue.fields.productName
                          .stringValue
                      }
                    </td>
                    <td>
                      {
                        productItems.doc.data.value.mapValue.fields
                          .pruductSupplierCategory.stringValue
                      }
                    </td>
                    <td>
                      {productItems.doc.data.value.mapValue.fields.productPrice
                        .doubleValue
                        ? productItems.doc.data.value.mapValue.fields
                            .productPrice.doubleValue
                        : productItems.doc.data.value.mapValue.fields
                            .productPrice.integerValue}
                    </td>
                    <td>
                      {
                        productItems.doc.data.value.mapValue.fields.productDate
                          .timestampValue
                      }
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between align-items-center">
          <p style={{ marginTop: 8, fontSize: 12, color: "#A1A1A1" }}>
            © 2023 JJSorem
          </p>
          <p style={{ marginTop: 8, fontSize: 12, color: "#A1A1A1" }}>
            {/* BOTON PARA EL CARRITO */}
            <Button style={{ backgroundColor: "#BD2B2B", borderWidth: 0 }}>
              Carro de Compras
            </Button>
            {/* BOTON PARA EL CARRITO */}
          </p>
        </Card.Footer>
      </Card>
    </>
  );
}

export default Product;
