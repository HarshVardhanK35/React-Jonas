import { useState } from "react";
import CabinTable from "../features/cabins/CabinTable";

import Button from "../ui/Button";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CreateCabinForm from "../features/cabins/CreateCabinForm";

function Cabins() {
  const [showForm, setShowForm] = useState(false);

  function handleShow() {
    setShowForm((showForm) => !showForm);
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">All cabins</Heading>
        <p>TEST</p>
      </Row>
      <Row type="vertical">
        <CabinTable />
        <Button onClick={handleShow}>
          {showForm ? "Close form" : "Add new cabin"}
        </Button>
        {showForm ? <CreateCabinForm /> : ""}
      </Row>
    </>
  );
}

export default Cabins;
