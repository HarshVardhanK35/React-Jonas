export default function Player({name, symbol}) {
    function handleEdit() {
        return ""
    }
    return (
      <li>
        <span className="player">
          <span className="player-name">{name}</span>
          <span className="player-symbol">{symbol}</span>
        </span>
        <button onClick={handleEdit}>Edit</button>
      </li>
    );
  }
  