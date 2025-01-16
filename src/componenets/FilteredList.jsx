import "../App.css";

// eslint-disable-next-line react/prop-types
export default function FilteredList({ listItem, text }) {
    // eslint-disable-next-line react/prop-types
    const filteredItems = listItem.filter((e) => e.date.substring(6) === text);
    const totalSum = filteredItems.reduce((sum, e) => sum + e.amount, 0);

    return (
        <div className="filteredListContainer">
            <ul>
                {filteredItems.map((e) => (
                    <li key={e.id} className="filteredItem">
                        <span>{e.listItemName}</span>
                        <span>{`${e.amount}$`}</span>
                        <span>{e.date}</span>
                    </li>
                ))}
            </ul>
            <p className="total">Total: <span className={totalSum >= 0 ? "positiveSum": "negativeSum"}>{`${totalSum}$`}</span></p>
        </div>
    );
}

