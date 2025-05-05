function Modal({ children }) {
  return (
    <>
      <h1>Highly Re-usable Modal</h1>
      <div className="modal">{children}</div>
    </>
  );
}
function Success(params) {
  return <p>Well done!</p>;
}
function Error() {
  return <p>Error: Something went wrong!</p>;
}

<Modal>
  <Success />
</Modal>;

<Modal>
  <Error />
</Modal>;
