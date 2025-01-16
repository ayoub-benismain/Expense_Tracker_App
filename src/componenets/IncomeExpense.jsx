// eslint-disable-next-line react/prop-types
function IncomeExpense({title , balance}) {
    return ( 
        <div className="IncomeExpenseCard">
            <p className='IncomeExpenseCardTitle'>{title}</p>
            <p className={title === "income" ? "incomeBalance" : "expenseBalance"}>{`$${balance}`}</p>
        </div>
     );
}

export default IncomeExpense;