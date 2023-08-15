'use client'

import { v4 as uuidv4 } from 'uuid'
import React, {useState} from 'react';
import { IconButton, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Checkbox, Stack } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { useDisclosure } from "@chakra-ui/react";

type columnTypes = "todo" | "inprogress" | "done"


type TaskProps = {
    id: string,
    type: columnTypes,
    content: string,
    important: boolean
  
  }

interface addTaskProps {
    addTask: (taskData: TaskProps) => void,
    type: columnTypes
}




const AddTask: React.FC<addTaskProps> = ({addTask, type }) => {


    const { isOpen, onOpen, onClose } = useDisclosure()
    const [currentValue, setCurrentValue] = useState("")
    const [isChecked, setIsChecked] = useState(false)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
      };


    function handleAddTask(){
        const newTask: TaskProps = {id: uuidv4(), type: type, content: currentValue, important: isChecked}
        addTask(newTask)

        console.log("add task: ", newTask)
        onClose()

    }

    return (
        <>
            <IconButton onClick={onOpen} aria-label='add item' colorScheme='gray.50' padding={1} size='s' icon={<AddIcon />} />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bgColor="rgba(0, 0, 0, 0.8)" />
                <ModalContent bgColor="gray.800" color="white">
                    <ModalHeader>Add Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={5}>
                            <Input variant='outline' placeholder='Outline' onChange={(e) => setCurrentValue(e.target.value)} />
                            <Checkbox colorScheme='teal'isChecked={isChecked} onChange={handleCheckboxChange}>
                                Important
                            </Checkbox>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme='teal' variant='solid' onClick={handleAddTask}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default AddTask