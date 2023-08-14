'use client'

import React, { useState, useEffect } from 'react';
import { Card, Flex, Text, Container, Heading, Stack } from "@chakra-ui/react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? "lightgreen" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
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
    columnData: TaskProps[]
}



const columns = {
    todo: { label: "To do" },
    inprogress: { label: "In progress" },
    done: { label: "Done" }

}

const Task: React.FC<TaskProps> = ({ id, type, content, important }) => {

    return (
        <Card width="100%" padding="1vh">
            <Text fontSize="20px">{content}</Text>
        </Card>
    )

}


const Column: React.FC<ColumnProps> = ({ type, columnData }) => {

    const [items, setItems] = useState<TaskProps[]>(columnData);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) {
            return;
        }

        const newItems = reorder(
            items,
            result.source.index,
            result.destination.index
        );

        setItems(newItems);
    };



    return (
        <>
            <Flex flexDirection="column"  >
                <Heading textAlign="center">
                    {columns[type].label}
                </Heading>
                <Container width="40vh" height="80vh" backgroundColor="gray.700" padding="2vh" borderRadius="2vh">
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided, snapshot) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={getListStyle(snapshot.isDraggingOver)}
                                >
                                    {items.map((item, index) => (
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
                                                    {item.content}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </Container>
            </Flex>
        </>
    );

}

export default Column