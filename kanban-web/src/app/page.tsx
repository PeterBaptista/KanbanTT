'use client'
import * as React from 'react'
import { Flex } from '@chakra-ui/react'
import Column from '../components/Column'


type columnTypes = "todo" | "inprogress" | "done"

interface TaskProps {
  id: string,
  type: columnTypes,
  content: string,
  important: boolean

}

const todoData: TaskProps[] = [
  { id: "1", type: "todo", content: "lavar pratos", important: false },
]

const inProgressData: TaskProps[] = [
  { id: "2", type: "inprogress", content: "Estudar Avlc", important: false },
  { id: "4", type: "inprogress", content: "Fazer o projeto Front-end", important: false },
  { id: "5", type: "inprogress", content: "Estudar Avlc231231", important: false },
  { id: "6", type: "inprogress", content: "Fazer o projeto Front-end4341321", important: false }
]

const doneData: TaskProps[] = [

  { id: "3", type: "done", content: "Varrer a casa", important: true }

]



export default function Home() {

  return (
    <main>
      <Flex flexDirection="row" justifyContent="space-around" alignItems="stretch">
        <Column type="todo" columnData={todoData} />
        <Column type="inprogress" columnData={inProgressData} />
        <Column type="done" columnData={doneData} />
      </Flex>
    </main>
  )
}
