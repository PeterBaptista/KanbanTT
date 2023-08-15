'use client'
import * as React from 'react'
import { useEffect } from 'react'
import { Flex, Heading, Box, Divider, Button, Stack, AbsoluteCenter, Center, Link } from '@chakra-ui/react'
import Column from '../components/Column'
import { Providers, useDataState, useDataDispatch } from './providers';
import { ArrowForwardIcon } from '@chakra-ui/icons'



type columnTypes = "todo" | "inprogress" | "done"



type TaskProps = {
  id: string,
  type: columnTypes,
  content: string,
  important: boolean

}

type KanbanData = {
  todoData: TaskProps[] | [],
  inProgressData: TaskProps[] | [],
  doneData: TaskProps[] | []
};

export default function Home() {

  const { kanbanData } = useDataState();
  const dispatch = useDataDispatch();


  const { todoData, inProgressData, doneData } = kanbanData

  function editTask(taskData: TaskProps) {
    let formattedData = []
    let payload: KanbanData = kanbanData


    switch (taskData.type) {
      case "todo":
        formattedData = todoData.map((item) => item.id === taskData.id ? taskData : item)
        payload = { ...kanbanData, todoData: formattedData }
        dispatch({ type: "SET_DATA", payload: payload })
        break;

      case "inprogress":
        formattedData = inProgressData.map((item) => item.id === taskData.id ? taskData : item)
        payload = { ...kanbanData, inProgressData: formattedData }
        dispatch({ type: "SET_DATA", payload })

        break;

      case "done":
        formattedData = doneData.map((item) => item.id === taskData.id ? taskData : item)
        payload = { ...kanbanData, doneData: formattedData }
        dispatch({ type: "SET_DATA", payload })
        break;

      default:
        break;
    }

    localStorage.setItem('kanbanData', JSON.stringify(payload));
  }


  function addTask(taskData: TaskProps) {
    let formattedData = []
    let payload: KanbanData = kanbanData


    switch (taskData.type) {
      case "todo":
        formattedData = [taskData, ...todoData]
        payload = { ...kanbanData, todoData: formattedData }
        console.log("Payload", payload)
        dispatch({ type: "SET_DATA", payload: payload })
        break;

      case "inprogress":
        formattedData = [taskData, ...inProgressData]
        payload = { ...kanbanData, inProgressData: formattedData }
        dispatch({ type: "SET_DATA", payload })

        break;

      case "done":
        formattedData = [taskData, ...doneData]
        payload = { ...kanbanData, doneData: formattedData }
        dispatch({ type: "SET_DATA", payload })
        break;

      default:
        break;
    }

    localStorage.setItem('kanbanData', JSON.stringify(payload));
  }


  console.log("kanbandata", kanbanData)
  return (
    <Providers>
      <main>
        <Box as='header' position='relative' padding='7' display="flex" justifyContent="space-between"  >
          <AbsoluteCenter px='4'>
            <Heading>Projeto Kanban</Heading>
          </AbsoluteCenter>
          <Button rightIcon={<ArrowForwardIcon />} colorScheme='teal' variant='solid'>
            <Link href='/dashboard'>DASHBOARD</ Link>
          </Button>
        </Box>
        <Divider marginBottom={5} borderWidth="2px" />

        <Flex flexDirection="row" justifyContent="space-around" alignItems="stretch">
          <Column kanbanData={kanbanData} useDispatch={(action) => dispatch(action)} columnData={kanbanData.todoData} type="todo" addTask={addTask} editTask={editTask} />
          <Column kanbanData={kanbanData} useDispatch={(action) => dispatch(action)} columnData={kanbanData.inProgressData} type="inprogress" addTask={addTask} editTask={editTask} />
          <Column kanbanData={kanbanData} useDispatch={(action) => dispatch(action)} columnData={kanbanData.doneData} type="done" addTask={addTask} editTask={editTask} />
        </Flex>
      </main>
    </Providers>
  )
}
