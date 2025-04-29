export default function Stats({ items }) {
  const numOfItems = items.length;
  const numOfPackedItem = items.filter((item) => {
    return item.packed;
  }).length;
  const percentageOfPacked = Math.round((numOfPackedItem / numOfItems) * 100);

  return (
    <>
      <footer className="stats">
        <em>
          {percentageOfPacked !== 100
            ? `You have ${numOfItems} items in your list, and you already packed{" "}
            ${numOfPackedItem} (${percentageOfPacked}%)`
            : ` You got everything! Ready to go!`}
        </em>
      </footer>
    </>
  );
}
