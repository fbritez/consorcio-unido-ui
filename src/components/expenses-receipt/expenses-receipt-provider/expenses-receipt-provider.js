import React, { useState, createContext } from 'react';
const ExpensesReceiptContext = createContext();

const ExpensesReceiptContextProvider = (props) => {
    const [expensesReceipt, setExpensesReceipt] = useState();
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const triggerRefresh = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <ExpensesReceiptContext.Provider value={{
            expensesReceipt: expensesReceipt,
            setExpensesReceipt : setExpensesReceipt,
            refreshTrigger: refreshTrigger,
            triggerRefresh: triggerRefresh
        }}>
        	{props.children}
        </ExpensesReceiptContext.Provider>
    );
}

export {
    ExpensesReceiptContextProvider,
    ExpensesReceiptContext
}