import { useState } from "react";

import CreateCabinForm from "./CreateCabinForm";

import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

function AddCabin() {
  return (
    <Modal>
      <Modal.Open opens="cabin-form">
        <Button>Add new cabin</Button>
      </Modal.Open>
      <Modal.Window name="cabin-form">
        <CreateCabinForm />
      </Modal.Window>

      {/* <Modal.Open open="table">
        <Button>Add new cabin</Button>
      </Modal.Open>
      <Modal.Window name="table">
        <CreateCabinForm />
      </Modal.Window> */}
    </Modal>
  );
}
export default AddCabin;

// function AddCabin() {
//   const [isOpenModal, setIsOpenModal] = useState(false);

//   function handleToggle() {
//     setIsOpenModal((isOpenModal) => !isOpenModal);
//   }
//   return (
//     <>
//       <Button onClick={handleToggle}>Add new cabin</Button>
//       {isOpenModal ? (
//         <Modal onClose={handleToggle}>
//           <CreateCabinForm onCloseModal={handleToggle} />
//         </Modal>
//       ) : (
//         ""
//       )}
//     </>
//   );
// }
// export default AddCabin;
