import './App.css';
import { useState, useRef, useEffect } from 'react';
import IncomeExpense from './componenets/IncomeExpense';
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaAngleUp } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import FilteredList from './componenets/FilteredList';

function App() {
  const [showPopup, setShowPopup] = useState(false); 
  const [listItem, setListItem] = useState([]);
  const [popupData, setPopupData] = useState({
    name: '',
    amount: '',
    date: ''
  });
  const [filteredListItem, setFilteredListItem] = useState(listItem); 
  const [show, setShow] = useState(false);
  const [years, setYears] = useState([]);  
  const showMenu = useRef();
  const arrow = useRef();
  const dropMenuHeaderText = useRef();
  const dropMenuHeader = useRef();
  const [drop, setDrop] = useState(false);

  useEffect(() => {
    const savedExpenses = JSON.parse(localStorage.getItem('expenses'));
    if (savedExpenses) {
      setListItem(savedExpenses);
      setFilteredListItem(savedExpenses);
    }
  }, []);

  useEffect(() => {
    if (listItem.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(listItem));
    }
  }, [listItem]);

  const calculateBalance = () => {
    const totalIncome = listItem.filter(item => item.amount > 0).reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = listItem.filter(item => item.amount < 0).reduce((sum, item) => sum + item.amount, 0);
    return totalIncome + totalExpense;
  };

  const handlePopupToggle = () => {
    setShowPopup(prevState => !prevState);
  };

  const formatDate = (date) => {
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newItem = {
      id: listItem.length + 1,
      listItemName: popupData.name,
      amount: parseFloat(popupData.amount),
      date: formatDate(popupData.date)
    };
    const updatedList = [...listItem, newItem];
    setListItem(updatedList);
    setFilteredListItem(updatedList);
    setShowPopup(false); 
  };

  const handleDeleteItem = (id) => {
    const updatedList = listItem.filter(item => item.id !== id);
    setListItem(updatedList);
    setFilteredListItem(updatedList); 
  };

  const handleYearSelect = (year) => {
    dropMenuHeaderText.current.innerHTML = year;
    const filteredItems = listItem.filter(item => item.date.substring(6) === year);
    setFilteredListItem(filteredItems);
    setShow(true);
    
    showMenu.current.style.visibility = "hidden";
    showMenu.current.style.height = '0';
    arrow.current.style.transform = "rotate(360deg)";
  };

  const showYears = () => {
    setDrop((prevState) => !prevState);

    const yearsArr = [];
    listItem.forEach((e) => {
      const year = e.date.substring(6);
      if (!yearsArr.includes(year)) {
        yearsArr.push(year);
      }
    });
    setYears(yearsArr);

    if (!drop) {
      showMenu.current.style.height = "auto";
      showMenu.current.style.visibility = "visible";
      arrow.current.style.transform = "rotate(180deg)";
    } else {
      showMenu.current.style.visibility = "hidden";
      showMenu.current.style.height = '0';
      arrow.current.style.transform = "rotate(360deg)";
    }
  };

  return (
    <>
      <div className="container">
        <h2 className="title">Expense Tracker</h2>
        <p className='balanceTitle'><span>y</span>our balance</p>
        <span className="balance">{`$${calculateBalance().toFixed(2)}`}</span>
        <hr />
        <div className="incomeExpense">
          <IncomeExpense title="income" balance={listItem.filter(item => item.amount > 0).reduce((sum, item) => sum + item.amount, 0)} />
          <IncomeExpense title="expense" balance={listItem.filter(item => item.amount < 0).reduce((sum, item) => sum + item.amount, 0)} />
        </div>
        <p className='listTitle'><span>E</span>xpense History List</p>
        <div className="list">
          <ul>
            {listItem.map((e, index) => {
              return (
                <div key={index} className='listItem'>
                  <span onClick={() => handleDeleteItem(e.id)} >
                    <MdOutlineDeleteOutline />
                  </span>
                  <li className={e.amount >= 0 ? "greenItem" : "redItem"}>
                    <p>{e.listItemName}</p>
                    <p>{`${e.amount}$`}</p>
                    <p>{e.date}</p>
                  </li>
                </div>
              );
            })}
          </ul>
        </div>

        <p className='filterTitle'><span>F</span>ilter By Year</p>
        <div className="filteringContent">
          <div className="dropDownMenu">
            <div className='dropDownMenuHead' onClick={showYears} ref={dropMenuHeader} >
              <p ref={dropMenuHeaderText}>Choose a year</p>
              <span ref={arrow} >
                <FaAngleUp />
              </span>
            </div>
            <ul className='yearItems' ref={showMenu} >
              {years.map((e, index) => {
                return <li key={index} className='yearItem' onClick={() => { handleYearSelect(e) }} >{e}</li>
              })}
            </ul>
          </div>
        </div>

        {show ? <FilteredList listItem={filteredListItem} text={dropMenuHeaderText.current.innerHTML} /> : ""}

        <div className="addExpense" onClick={handlePopupToggle}>
          <span>
            <FaPlus />
          </span>
        </div>

        {showPopup && (
          <div className="popup">
            <div className="popup-content">
              <form onSubmit={handleSubmit}>
                <div>
                  <label>Name</label>
                  <input
                    type="text"
                    value={popupData.name}
                    onChange={(e) => setPopupData({ ...popupData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>Amount</label>
                  <input
                    type="number"
                    value={popupData.amount}
                    onChange={(e) => setPopupData({ ...popupData, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>Date</label>
                  <input
                    type="date"
                    value={popupData.date}
                    onChange={(e) => setPopupData({ ...popupData, date: e.target.value })}
                    required
                  />
                </div>
                <button type="submit">Add Expense</button>
              </form>
              <button className="close" onClick={() => setShowPopup(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
