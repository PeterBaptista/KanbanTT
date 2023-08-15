'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Text, Box, Heading, IconButton, ButtonGroup, Divider } from "@chakra-ui/react";
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvidedDraggableProps } from "react-beautiful-dnd";
import AddTask from './AddTask';
import EditTask from './EditTask';

const reorder = (list: TaskProps[] , startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging: boolean, draggableStyle: DraggableProvidedDraggableProps["style"]) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    margin: `0 0 ${grid}px 0`,
    borderRadius: "5px",

    // change background colour if dragging
    background: isDragging ? "#B7791F" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "#4A5568" : "#171923",
    borderRadius: "15px",

    padding: grid,
    width: 250
});


type columnTypes = "todo" | "inprogress" | "done"


interface TaskProps {
    id: string,
    type: columnTypes,
    content: string,
    important: boolean

}

interface ColumnProps {
    type: columnTypes,
    columnData: TaskProps[],
    addTask: (taskData: TaskProps) => void,
    editTask: (taskData: TaskProps) => void,
    setColumnData: (columnData: TaskProps[], type: columnTypes) => void

}




const columns = {
    todo: { label: "To do" },
    inprogress: { label: "In progress" },
    done: { label: "Done" }

}



const Column: React.FC<ColumnProps> = ({ type, columnData, addTask, editTask, setColumnData }) => {

    

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const newItems = reorder(
            columnData,
            result.source.index,
            result.destination.index
        );

        setColumnData(newItems, type);
    };
    




    return (
        <>
            <div>


                <DragDropContext onDragEnd={onDragEnd}>

                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                <Box display="flex" alignItems="center" justifyContent="space-between">

                                    <Heading padding="10px 10px 10px 10px" fontSize="20px" marginBottom="20px" color="gray.300">
                                        {columns[type].label}
                                    </Heading>

                                    <AddTask addTask={addTask} type={type}/>
                                </Box>
                                <Divider color="white" marginBottom={5} />

                                {columnData.map((item, index) => (
                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <Card alignItems="center"
                                                    direction={{ base: 'column', sm: 'row' }}
                                                    overflow='hidden'
                                                    paddingRight={3}
                                                    background={item.important === true ? "red.300" : "gray.300"}
                                                >
                                                    <CardBody overflow='hidden' maxHeight="140px">
                                                        <Text>{item.content}</Text>
                                                    </CardBody>
                                                    <EditTask id={item.id} task={item.content} type={type} editTask={editTask}/>
                                                </Card>

                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        </>
    );

}

export default Column