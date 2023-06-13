import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Image,
  Button,
  Modal,
  Form,
  FloatingLabel,
  Spinner,
} from "react-bootstrap";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { Link } from "react-router-dom";

import ServiceFire from "../utils/services/ServiceFire";
import LoggedFailed from "../components/LoggedFailed";
import "firebase/firestore";

function Crud(props) {
  const [user, setUser] = useState(null);
  const [productItems, setProductItems] = useState([]);
  const [supplierCategories, setSupplierCategories] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const [currentProductItem, setCurrentProductItem] = useState({
    productName: "",
    pruductSupplierCategory: "",
    productPrice: 0,
    productDate: null,
  });
  const [currentProductItemId, setCurrentProductItemId] = useState("");

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setUser(user);
    } else {
      setUser(null);
    }
  });

  function fetchMenuCategories() {
    setIsLoading(true);
    ServiceFire.getAllSupplierCategories()
      .then((response) => {
        setIsLoading(false);
        setSupplierCategories(response._delegate._snapshot.docChanges);
      })
      .catch((e) => {
        setIsLoading(false);
        alert("Error capturando las categorias existentes. " + e);
      });
  }

  function fetchProductItems() {
    setIsLoading(true);
    ServiceFire.getAllProductItems()
      .then((response) => {
        setIsLoading(false);
        setProductItems(response._delegate._snapshot.docChanges);
      })
      .catch((e) => {
        setIsLoading(false);
        alert("Error capturando los productos existentes. " + e);
      });
  }

  useEffect(() => {
    if (user !== null) {
      if (supplierCategories.length <= 0) {
        fetchMenuCategories();
      }
      fetchProductItems();
    }
  }, [user]);

  const [showAddEditForm, setShowAddEditForm] = useState(false);
  const [addEditFormType, setAddEditFormType] = useState("Add"); //Add, Edit
  const [validated, setValidated] = useState(false);

  const [showDeleteDialogue, setShowDeleteDialogue] = useState(false);

  const handleModalClose = () => {
    setShowAddEditForm(false);
    setShowDeleteDialogue(false);
    setCurrentProductItemId("");
    setAddEditFormType("Add");
    setCurrentProductItem({
      productName: "",
      pruductSupplierCategory: "",
      productPrice: 0,
      productDate: null,
    });
    setIsLoading(false);
  };

  const handleAddEditFormSubmit = (event) => {
    event.preventDefault();
    const { productName, pruductSupplierCategory, productPrice, productDate } =
      event.target.elements;

    if (productPrice.value && productName.value) {
      if (addEditFormType === "Add") {
        setIsLoading(true);
        ServiceFire.AddNewProductItem(
          productName.value,
          pruductSupplierCategory.value,
          productPrice.value,
          productDate.value
        )
          .then(() => {
            alert(`${productName.value} se agrego exitosamente.`);
            handleModalClose();
            window.location.reload(false);
          })
          .catch((e) => {
            alert("Error occured: " + e.message);
            setIsLoading(false);
          });
      } else if (addEditFormType === "Edit") {
        setIsLoading(true);
        ServiceFire.UpateProductItem(
          currentProductItemId,
          productName.value,
          pruductSupplierCategory.value,
          productPrice.value,
          productDate.value
        )
          .then(() => {
            alert(`${productName.value} se actualizo exitosamente.`);
            handleModalClose();
            window.location.reload(false);
          })
          .catch((e) => {
            alert("Error occured: " + e.message);
            setIsLoading(false);
          });
      }
    }
    setValidated(true);
  };

  const handleMenuItemDelete = () => {
    setIsLoading(true);
    ServiceFire.DeleteProductItem(currentProductItemId)
      .then(() => {
        alert(`Se borro exitosamente`);
        handleModalClose();
        window.location.reload(false);
      })
      .catch((e) => {
        alert("Error occured: " + e.message);
        setIsLoading(false);
      });
  };

  const LogoutButton = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        setValidated(false);
      })
      .catch((e) => {
        alert(e.message);
      });
  };

  return (
    <>
      {user === null && <LoggedFailed />}
      {isLoading === true && <Spinner animation="border" variant="secondary" />}
      {user !== null && (
        <>
          <Modal show={showAddEditForm} onHide={handleModalClose}>
            <Form
              noValidate
              validated={validated}
              onSubmit={handleAddEditFormSubmit}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {addEditFormType === "Add" ? "Add Menu Item" : "Edit"}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FloatingLabel
                  controlId="productName"
                  label="Producto"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingrese el nombre del producto"
                    size="md"
                    value={currentProductItem?.productName}
                    onChange={(e) => {
                      setCurrentProductItem({
                        productName: e.target.value ? e.target.value : "",
                        pruductSupplierCategory:
                          currentProductItem?.pruductSupplierCategory,
                        productPrice: currentProductItem?.productPrice,
                        productDate: firebase.firestore.Timestamp.fromDate(
                          new Date(currentProductItem?.productDate)
                        ),
                      });
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    El nombre del producto es necesario
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  controlId="pruductSupplierCategory"
                  label="Proveedor"
                  className="mb-3"
                >
                  <Form.Select
                    value={currentProductItem?.pruductSupplierCategory}
                    onChange={(e) => {
                      setCurrentProductItem({
                        productName: currentProductItem?.productName,
                        pruductSupplierCategory: e.target.value,
                        productPrice: currentProductItem?.productPrice,
                        productDate: firebase.firestore.Timestamp.fromDate(
                          new Date(currentProductItem?.productDate)
                        ),
                      });
                    }}
                  >
                    {supplierCategories &&
                      supplierCategories.map((supplierCategory, index) => (
                        <option
                          key={index}
                          value={
                            supplierCategory.doc.data.value.mapValue.fields
                              .catName.stringValue
                          }
                        >
                          {
                            supplierCategory.doc.data.value.mapValue.fields
                              .catName.stringValue
                          }
                        </option>
                      ))}
                  </Form.Select>
                </FloatingLabel>

                <FloatingLabel
                  controlId="productPrice"
                  label="Precio"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    type="text"
                    placeholder="Ingrese el precio del producto"
                    size="md"
                    value={currentProductItem?.productPrice}
                    onChange={(e) => {
                      setCurrentProductItem({
                        productName: currentProductItem?.productName,
                        pruductSupplierCategory:
                          currentProductItem?.pruductSupplierCategory,
                        productPrice: e.target.value,
                        productDate: firebase.firestore.Timestamp.fromDate(
                          new Date(currentProductItem?.productDate)
                        ),
                      });
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Se requiere el precio del producto
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                  controlId="productDate"
                  label="Fecha"
                  className="mb-3"
                >
                  <Form.Control
                    required
                    type="date"
                    size="md"
                    value={currentProductItem?.productDate}
                    onChange={(e) => {
                      setCurrentProductItem({
                        productName: currentProductItem?.productName,
                        pruductSupplierCategory:
                          currentProductItem?.pruductSupplierCategory,
                        productPrice: currentProductItem?.productPrice,
                        productDate: firebase.firestore.Timestamp.fromDate(
                          new Date(e.target.value)
                        ),
                      });
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    Se requiere la fecha del producto
                  </Form.Control.Feedback>
                </FloatingLabel>
              </Modal.Body>
              <Modal.Footer>
                <Button type="submit">
                  {addEditFormType === "Add" ? "Add" : "Update"}
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          <Modal show={showDeleteDialogue} onHide={handleModalClose}>
            <Modal.Header closeButton>
              <Modal.Title>Borrar {currentProductItem.productName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>
                Esta seguro que desea borrar {currentProductItem.productName}?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleModalClose}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={handleMenuItemDelete}>
                Si, Borrar
              </Button>
            </Modal.Footer>
          </Modal>

          <Card style={{ margin: 24 }}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="align-items-center" style={{ marginRight: 8 }}>
                <Image
                  src={
                    "https://siamangtec.files.wordpress.com/2022/08/tiendaonline-3.png"
                  }
                  style={{ width: 80 }}
                />
                <h4 style={{ marginTop: 8 }}>Crud</h4>
              </div>
              <Button
                variant="success"
                style={{ borderWidth: 0 }}
                onClick={() => {
                  setShowAddEditForm(true);
                }}
              >
                Agregar Producto
              </Button>
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
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {productItems &&
                    productItems.map((productItem, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {
                            productItem.doc.data.value.mapValue.fields
                              .productName.stringValue
                          }
                        </td>
                        <td>
                          {
                            productItem.doc.data.value.mapValue.fields
                              .pruductSupplierCategory.stringValue
                          }
                        </td>
                        <td>
                          {productItem.doc.data.value.mapValue.fields
                            .productPrice.doubleValue
                            ? productItem.doc.data.value.mapValue.fields
                                .productPrice.doubleValue
                            : productItem.doc.data.value.mapValue.fields
                                .productPrice.integerValue}
                        </td>
                        <td>
                          {
                            productItem.doc.data.value.mapValue.fields
                              .productDate.timestampValue
                          }
                        </td>
                        <td>
                          <Button
                            variant="primary"
                            onClick={() => {
                              setCurrentProductItemId(
                                productItem.doc.key.path.segments[
                                  productItem.doc.key.path.segments.length - 1
                                ]
                              );
                              setCurrentProductItem({
                                productName:
                                  productItem.doc.data.value.mapValue.fields
                                    .productName.stringValue,

                                pruductSupplierCategory:
                                  productItem.doc.data.value.mapValue.fields
                                    .pruductSupplierCategory.stringValue,

                                productPrice: productItem.doc.data.value
                                  .mapValue.fields.productPrice.doubleValue
                                  ? productItem.doc.data.value.mapValue.fields
                                      .productPrice.doubleValue
                                  : productItem.doc.data.value.mapValue.fields
                                      .productPrice.integerValue,

                                productDate:
                                  productItem.doc.data.value.mapValue.fields
                                    .productDate.timestampValue,
                              });
                              setAddEditFormType("Edit");
                              setShowAddEditForm(true);
                            }}
                          >
                            ✎ Edit
                          </Button>{" "}
                          <Button
                            variant="danger"
                            onClick={() => {
                              setCurrentProductItemId(
                                productItem.doc.key.path.segments[
                                  productItem.doc.key.path.segments.length - 1
                                ]
                              );
                              setCurrentProductItem({
                                productName:
                                  productItem.doc.data.value.mapValue.fields
                                    .productName.stringValue,

                                pruductSupplierCategory:
                                  productItem.doc.data.value.mapValue.fields
                                    .pruductSupplierCategory.stringValue,

                                productPrice: productItem.doc.data.value
                                  .mapValue.fields.productPrice.doubleValue
                                  ? productItem.doc.data.value.mapValue.fields
                                      .productPrice.doubleValue
                                  : productItem.doc.data.value.mapValue.fields
                                      .productPrice.integerValue,

                                productDate:
                                  productItem.doc.data.value.mapValue.fields
                                    .productDate.timestampValue,
                              });
                              setShowDeleteDialogue(true);
                            }}
                          >
                            x Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center">
              <p style={{ marginTop: 8, fontSize: 12, color: "#A1A1A1" }}>
                <Link to="/">
                  <Button
                    variant="danger"
                    onClick={LogoutButton}
                    style={{
                      borderWidth: 0,
                    }}
                  >
                    Logout
                  </Button>
                </Link>
              </p>
            </Card.Footer>
          </Card>
        </>
      )}
    </>
  );
}

export default Crud;
