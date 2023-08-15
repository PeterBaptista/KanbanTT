'use client'
import * as React from 'react'
import { Flex, Heading, Box, Divider, AbsoluteCenter, Text } from '@chakra-ui/react'
import Column from '../components/Column'


type columnTypes = "todo" | "inprogress" | "done"

type TaskProps = {
  id: string,
  type: columnTypes,
  content: string,
  important: boolean

}






export default function Home() {


  const [todoData, setTodoData] = React.useState<TaskProps[] | []>([])
  const [inProgressData, setInProgressData] = React.useState<TaskProps[] | []>([])
  const [doneData, setDoneData] = React.useState<TaskProps[] | []>([])

  function editTask(taskData: TaskProps){
      let formattedData = []
      
      switch (taskData.type) {
        case "todo":
          formattedData = todoData.map((item) => item.id === taskData.id ? taskData : item)
          setTodoData(formattedData)
          break;

        case "inprogress":
          console.log("entrou")
          formattedData = inProgressData.map((item) => item.id === taskData.id ? taskData : item)
          console.log(formattedData)
          setInProgressData(formattedData)
          break;

        case "done":
          formattedData = doneData.map((item) => item.id === taskData.id ? taskData : item)
          setDoneData(formattedData)
          break;

        default:
          break;
      }

      console.log(taskData)
  }

  function addTask(taskData: TaskProps){
    let formattedData = []
    
    switch (taskData.type) {
      case "todo":
        formattedData = [taskData,...todoData]
        setTodoData(formattedData)
        break;

      case "inprogress":
        console.log("entrou")
        formattedData = [taskData, ...inProgressData]
        console.log(formattedData)
        setInProgressData(formattedData)
        break;

      case "done":
        formattedData = [taskData, ...doneData]
        setDoneData(formattedData)
        break;

      default:
        break;
    }

    console.log(taskData)
}
  
  function setColumnData(columnData: TaskProps[], type: columnTypes){
    
    switch (type) {
      case "todo":
        
        setTodoData(columnData)
        break;

      case "inprogress":

        setInProgressData(columnData)
        break;

      case "done":
        
        setDoneData(columnData)
        break;

      default:
        break;
    }

}

  return (
    <main>
      <Box position='relative' padding='10'>
        <Divider />
        <AbsoluteCenter bg="black" px='4'>
          <Heading>Projeto Kanban</Heading>
        </AbsoluteCenter>
      </Box>
      <Flex flexDirection="row" justifyContent="space-around" alignItems="stretch">
        <Column type="todo" columnData={todoData} addTask={addTask} editTask={editTask} setColumnData={setColumnData} />
        <Column type="inprogress" columnData={inProgressData} addTask={addTask} editTask={editTask} setColumnData={setColumnData} />
        <Column type="done" columnData={doneData} addTask={addTask} editTask={editTask} setColumnData={setColumnData} />
      </Flex>
    </main>
  )
}
