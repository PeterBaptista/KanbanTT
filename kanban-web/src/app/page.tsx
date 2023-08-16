'use client'
import * as React from 'react'
import { useEffect } from 'react'
import { Flex, Heading, Box, Divider, Button, Stack, AbsoluteCenter, Center, Link } from '@chakra-ui/react'
import Column from '../components/Column'
import { Providers, useDataState, useDataDispatch } from './providers';
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { DragDropContext, DraggableLocation, DropResult } from 'react-beautiful-dnd'



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


const reorder = (list: TaskProps[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  console.log('reorder - list', list)
  console.log('reorder: ', result)

  return result;
};

const move = (source: TaskProps[], destination: TaskProps[], droppableSource: DraggableLocation, droppableDestination: DraggableLocation) => {
  const sourceClone = Array.from(source);
  console.log("sourceClone: ", sourceClone)
  const destClone = Array.from(destination);
  console.log("destclone: ", destClone)
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {source: {}, dest: {}}
  result.source = sourceClone;
  result.dest = destClone;

  
  console.log('move: ', result)

  return result;
};

export default function Home() {

  const { kanbanData } = useDataState();
  const dispatch = useDataDispatch();
  const { todoData, inProgressData, doneData } = kanbanData

  
  

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    let destinationColumn: TaskProps[] = kanbanData.todoData;
    let newItems: TaskProps[] = kanbanData.todoData;
    let payload: KanbanData = kanbanData
    let sourceColumn: TaskProps[] = kanbanData.todoData;
    let sourceName = "";
    let destName = "";
    let moveResult = {source: {}, dest: {}};

    if (!destination) {
      return;
    }
    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;
    console.log("sInd", sInd)
    console.log("dInd", dInd)

  
    
  switch (sInd) {
    case 0:
        sourceColumn = kanbanData.todoData
        sourceName = "todoData"
        break;

    case 1:
        sourceColumn = kanbanData.inProgressData
        sourceName = "inProgressData"
        break;
    case 2:
        sourceColumn = kanbanData.doneData
        sourceName = "doneData"
        break;
    default:
        break;
    }

  

  switch (dInd.toString()) {
    case '0':
        destinationColumn = kanbanData.todoData
        destName = "todoData"
        break;
    case '1':
        destinationColumn = kanbanData.inProgressData
        destName = "inProgressData"
        break;
    case '2':
       destinationColumn = kanbanData.doneData
       destName = "doneData"
        break;
    default:
        break;
}



  if (sInd === dInd) {
    newItems = reorder(sourceColumn, source.index, destination.index);
    payload = { ...kanbanData, [sourceName]: newItems }

  } else {
    moveResult = move(sourceColumn, destinationColumn, source, destination);
    payload = { ...kanbanData, [sourceName]: moveResult.source, [destName]: moveResult.dest }

  }
  dispatch({ type: "SET_DATA", payload: payload })
  localStorage.setItem('kanbanData', JSON.stringify(payload));

}

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
        <DragDropContext onDragEnd={onDragEnd}>
          <Column kanbanData={kanbanData} useDispatch={(action) => dispatch(action)} columnData={kanbanData.todoData} type="todo" addTask={addTask} editTask={editTask} />
          <Column kanbanData={kanbanData} useDispatch={(action) => dispatch(action)} columnData={kanbanData.inProgressData} type="inprogress" addTask={addTask} editTask={editTask} />
          <Column kanbanData={kanbanData} useDispatch={(action) => dispatch(action)} columnData={kanbanData.doneData} type="done" addTask={addTask} editTask={editTask} />
        </DragDropContext>
        </Flex>
      </main>
    </Providers>
  )
}
