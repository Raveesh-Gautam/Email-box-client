import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import EmailItem from "./EmailItem";

function NavBar() {
  return (
    <div>
      <Navbar expand="lg" bg="primary" variant="dark">
        <Container fluid>
          <Navbar.Brand href="#">Yahoo/Mail</Navbar.Brand>

          <Form className="d-flex flex-start">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
              style={{
                width: "500px",
                display: "flex",
                justifyContent: "center",
              }}
            />
            <Button variant="warning">Search</Button>
          </Form>
        </Container>
      </Navbar>
      <EmailItem />
    </div>
  );
}

export default NavBar;
