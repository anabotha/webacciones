
import React from 'react';

export const Tabs = ({ value, onValueChange, children, className }) => {

     return (
          <TabsContext.Provider value={{ value, onValueChange }}>
               <div className={className}>{children}</div>
          </TabsContext.Provider>
     );
};

const TabsContext = React.createContext({});

export const TabsList = ({ className, children }) => {
     return <div className={`flex space-x-2 bg-gray-100 p-1 rounded-lg ${className}`}>{children}</div>;
};

export const TabsTrigger = ({ value, children, className }) => {
     const { value: selectedValue, onValueChange } = React.useContext(TabsContext);
     const isSelected = selectedValue === value;
     return (
          <button
               className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${isSelected ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'
                    } ${className}`}
               onClick={() => onValueChange(value)}
          >
               {children}
          </button>
     );
};

export const TabsContent = ({ value, children }) => {
     const { value: selectedValue } = React.useContext(TabsContext);
     if (value !== selectedValue) return null;
     return <div>{children}</div>;
};
