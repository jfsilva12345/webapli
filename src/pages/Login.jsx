import React, { useState } from "react";
import { Card, Form, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";

import firebase from "firebase/compat/app";
import "firebase/compat/auth";

function Login(props) {
  const [validate, setValidated] = useState(false);
  const [user, setUser] = useState(null);

  firebase.auth().onAuthStateChanged((oAuth) => {
    if (oAuth) {
      setUser(oAuth);
    } else {
      setUser(null);
    }
  });

  const LoginButton = (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then((userCredentails) => {
        var user = userCredentails.user;
        setUser(user);
        setValidated(true);
      })
      .catch((e) => {
        alert(e.message);
        setValidated(true);
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
      {user === null && (
        <Card style={{ margin: 24 }}>
          <Card.Header>
            <Image
              src={
                "https://siamangtec.files.wordpress.com/2022/08/tiendaonline-3.png"
              }
              style={{ width: 80, marginBottom: 8 }}
            />
            <h4>Logueo de Administrador</h4>
            <p style={{ marginTop: 8, fontSize: 12, color: "#A1A1A1" }}>
              Inicio de sesion del administrador para la gestion de los
              productos
            </p>
          </Card.Header>
          <Card.Body>
            <Form noValidate validated={validate} onSubmit={LoginButton}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Introduzca el correo del administrador"
                  size="md"
                />
                <Form.Control.Feedback type="invalid">
                  Se requiere un correo.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="password">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese la contraseña del administrador"
                  size="md"
                />
                <Form.Control.Feedback type="invalid">
                  Se requiere la contraseña.
                </Form.Control.Feedback>
              </Form.Group>

              <Button
                variant="success"
                type="submit"
                size="md"
                style={{ fontWeight: "bold" }}
              >
                Login ❯
              </Button>
            </Form>
          </Card.Body>
          <Card.Footer>
            <Link to="/">
              <Button variant="primary" style={{ borderWidth: 0 }}>
                ← Pagina principal
              </Button>
            </Link>
          </Card.Footer>
        </Card>
      )}
      {user !== null && (
        <div style={{ margin: 24 }}>
          <p>
            Logueo existoso, por favor dirijase a la pantalla admin en este
            boton{" "}
            <Link to="/crud">
              <Button
                variant="success"
                style={{
                  borderWidth: 0,
                }}
              >
                dashboard
              </Button>
            </Link>
          </p>
          <p>
            <Button
              variant="danger"
              onClick={LogoutButton}
              style={{
                borderWidth: 0,
              }}
            >
              Logout
            </Button>

          </p>
        </div>
      )}
    </>
  );
}

export default Login;
