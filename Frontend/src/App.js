import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [datetime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/api/transactions';
    const response = await fetch(url);
    return await response.json();
  }

  function addNewTransaction(ev) {
    ev.preventDefault();
    const url = `${process.env.REACT_APP_API_URL}/transaction`;
    const price = name.split(' ')[0];

    const newTransaction = {
      price: parseFloat(price), // Ensure price is a number
      name: name.substring(price.length + 1),
      description,
      datetime: formatDateTime(datetime), // Format the datetime
    };

    fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(newTransaction),
    })
    .then(response => response.json())
    .then(json => {
      // Prepend the new transaction to the existing transactions
      setTransactions(prevTransactions => [json, ...prevTransactions]); // Add the response from the server if needed
      // Clear the input fields
      setName('');
      setDescription('');
      setDateTime('');
    });
  }

  function formatDateTime(datetime) {
    const date = new Date(datetime);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    const hours = (`0${date.getHours()}`).slice(-2);
    const minutes = (`0${date.getMinutes()}`).slice(-2);
    
    return `${year}-${month}-${day} ${hours}:${minutes}`; // Format as yyyy-mm-dd hh:mm
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance += transaction.price;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];

  return (
    <main>
      <h1>${balance}<span>{fraction}</span></h1>
      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input
            type="text"
            value={name}
            onChange={ev => setName(ev.target.value)}
            placeholder='+200 new samsung tv'
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={ev => setDateTime(ev.target.value)}
          />
        </div>
        <div className='description'>
          <input
            type="text"
            value={description}
            onChange={ev => setDescription(ev.target.value)}
            placeholder='description'
          />
        </div>
        <button type="submit">
          Add New Transaction
        </button>
      </form>
      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transaction => (
          <div className='transaction' key={transaction._id}>
            <div className='left'>
              <div className='name'>{transaction.name}</div>
              <div className='description'>{transaction.description}</div>
            </div>
            <div className='right'>
              <div className={`price ${(transaction.price < 0 ? 'red' : 'green')}`}>
                {transaction.price}
              </div>
              <div className='datetime'>
                {formatDateTime(transaction.datetime)} {/* Use custom format */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;
