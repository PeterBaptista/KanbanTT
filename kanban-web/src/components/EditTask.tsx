'use client'


import React, { useState } from 'react';
import { IconButton, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Input, Checkbox, Stack } from '@chakra-ui/react';
import { EditIcon } from '@chakra-ui/icons';
import { useDisclosure } from "@chakra-ui/react";

type columnTypes = "todo" | "inprogress" | "done"

type TaskProps = {
    id: string,
    type: columnTypes,
    content: string,
    important: boolean
  
  }

interface editTaskProps {
    editTask: (taskData: TaskProps) => void,
    type: columnTypes,
    id: string,
    task: string
}


const EditTask: React.FC<editTaskProps> = ({editTask, id, task, type}) => {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [currentValue, setCurrentValue] = useState(task)
    const [isChecked, setIsChecked] = useState(false)

    const handleCheckboxChange = () => {
        setIsChecked(!isChecked);
      };


    function handleEditTask(){
        const edittedTask: TaskProps = {id: id, type: type, content: currentValue, important: isChecked}
        editTask(edittedTask)
        
        console.log(edittedTask)
        onClose()

    }

    return (
        <>
            <IconButton onClick={onOpen} aria-label='edit item' padding={1} size='s' icon={<EditIcon />} />

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay bgColor="rgba(0, 0, 0, 0.8)" />
                <ModalContent bgColor="gray.800" color="white">
                    <ModalHeader>Edit Task</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Stack spacing={5}>

                            <Input
                                value={currentValue}
                                onChange={(e) => setCurrentValue(e.target.value)}
                            />

                            <Checkbox colorScheme='teal' isChecked={isChecked} onChange={handleCheckboxChange}>
                                Important
                            </Checkbox>
                        </Stack>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme='teal' variant='solid' onClick={handleEditTask}>
                            Edit
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default EditTask