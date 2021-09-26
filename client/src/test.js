import { useState } from "react";
import { AiOutlineGithub, AiOutlineTwitter } from "react-icons/ai";
import { FaDiscord, FaLinkedin } from "react-icons/fa";

// variable to store input and output values
const initialValues = {
  billAmount: "",
  cash: ""
};

export default function CashRegister() {
  //state variable track changes in the values
  const [values, setValues] = useState(initialValues);
  const [check, setCheck] = useState(true);
  const [output, setOutput] = useState([]);

  //store input values in state variable
  function handleInputChange(event) {
    const { name, value } = event.target;
    setValues({
      ...values,
      [name]: Number(value)
    });
  }

  const handleCheck = () => {
    // if (values.billAmount !== null) {
    setCheck(true);
    console.log(check);
    // }
  };
  //demonination array
  const notes = [2000, 500, 100, 20, 10, 5, 1];

  //output array - no of notes needed
  let numberOfNotes = [0, 0, 0, 0, 0, 0, 0];

  var returnedAmount = values.cash - values.billAmount;

  //function to calculate no of notes to be returned of each denomination
  function calculateChange() {
    if (parseInt(values.billAmount) <= 0 || parseInt(values.cash) <= 0) {
      console.log("Bill Amount should be greater than zero");
    } else if (parseInt(values.billAmount) > parseInt(values.cash)) {
      console.log("cash should be greater then bill amount");
    } else {
      for (let i = 0; i < notes.length; i++) {
        if (returnedAmount >= notes[i]) {
          numberOfNotes[i] = Math.trunc(returnedAmount / notes[i]);
          returnedAmount = returnedAmount - numberOfNotes[i] * notes[i];
        }
      }
      setOutput(numberOfNotes);
    }
  }
  return (
    <div className="container">
      <h1> Cash Register App</h1>
      <div className="input-group">
        <label htmlFor="billAmount">Bill Amount:</label>
        <input
          type="number"
          placeholder="Enter the bill amount"
          onChange={handleInputChange}
          name="billAmount"
        />
        <button onClick={handleCheck}>Check</button>
      </div>

      {check === "true" ? (
        <>
        <div className="input-group">
            <label htmlFor="billAmount">Cash Given:</label>
            <input
            type="number"
            placeholder="Enter the cash given"
            name="cash"
            onChange={handleInputChange}
            />
            <button onClick={calculateChange} className="calculate-btn">
            Calculate Change
            </button>
        </div>
        <div className="output-container">
          <table>
            <caption>Return Change</caption>
            <tbody>
              <tr>
                <th>Note</th>
                {notes.map((note) => (
                  <td key={note}>{note}</td>
                ))}
              </tr>
              <tr>
                <th>No. of Notes</th>
                {output.map((n, index) => (
                  <td key={index}>{n}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        </>
      ) : null} 
      
      {/*footer  */}
      <footer>
        <ul className="footer-list">
          <li>
            <a
              href="https://github.com/anshulraheja"
              target="_blank"
              rel="noreferrer"
            >
              <AiOutlineGithub />
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/anshul-raheja/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
            </a>
          </li>
          <li>
            <a
              href="https://discord.com/channels/anshulraheja#3744"
              target="_blank"
              rel="noreferrer"
            >
              <FaDiscord />
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/anshulrahejaa"
              target="_blank"
              rel="noreferrer"
            >
              <AiOutlineTwitter />
            </a>
          </li>
        </ul>
      </footer>
    </div>
  );
}
