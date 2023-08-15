// app/providers.tsx
'use client'


import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'



type columnTypes = "todo" | "inprogress" | "done"

interface TaskProps {
  id: string,
  type: columnTypes,
  content: string,
  important: boolean

}


type KanbanData = {
  todoData: TaskProps[],
  inProgressData: TaskProps[],
  doneData: TaskProps[]
};



type Action = {
  type: 'SET_DATA',
  payload: KanbanData
}

type State = {
  kanbanData: KanbanData
}

const dataReducer = (state: State, action: Action) => {
  console.log("action", action)
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, kanbanData: action.payload }

    default:
      return state;
  }
}


const DataStateContext = createContext<State | undefined>(undefined);
const DataDispatchContext = createContext<React.Dispatch<Action> | undefined>(undefined);

export const useDataState = () => {
  const context = useContext(DataStateContext);
  if (context === undefined) {
    throw new Error('useDataState must be used within a DataProvider');
  }
  return context;
};

export const useDataDispatch = () => {
  const context = useContext(DataDispatchContext);

  if (context === undefined) {
    throw new Error('useDataDispatch must be used within a DataProvider');
  }
  return context;
};



export function Providers({
  children
}: {
  children: React.ReactNode
}) {


  const initialData = { todoData: [], inProgressData: [], doneData: [] }

  const [state, dispatch] = useReducer(dataReducer, { kanbanData: initialData }); // Initialize with your initial data

  useEffect(() => {
    // Load data from LocalStorage when the app loads
    const storedData = localStorage.getItem('kanbanData');
    console.log("store", storedData)
    if (storedData) { dispatch({ type: 'SET_DATA', payload: JSON.parse(storedData) }); }
  }, []);
  



  return (
    <DataStateContext.Provider value={state}>
      <DataDispatchContext.Provider value={dispatch}>
        <CacheProvider>
          <ChakraProvider>
            {children}
          </ChakraProvider>
        </CacheProvider>
      </DataDispatchContext.Provider>
    </DataStateContext.Provider>
  )
}