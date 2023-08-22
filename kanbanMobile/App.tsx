import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import {
  RenderItemParams,
  ScaleDecorator, NestableScrollContainer, NestableDraggableFlatList,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AddTask from "./components/AddTask";
import EditTask from "./components/EditTask";
import AsyncStorage from '@react-native-async-storage/async-storage';

const saveKanbanDataToStorage = async (kanbanData: KanbanData) => {
  try {
    const jsonKanbanData = JSON.stringify(kanbanData);
    await AsyncStorage.setItem('KanbanData', jsonKanbanData);
    console.log("jsonKanbanData- save: ", jsonKanbanData)
  } catch (error) {
    console.error('Error saving KanbanData:', error);
  }
};

const loadKanbanDataFromStorage = async (): Promise<KanbanData> => {
  try {
    const jsonKanbanData = await AsyncStorage.getItem('KanbanData');
    console.log("jsonKanbanData - loading: ", jsonKanbanData)
    return jsonKanbanData ? JSON.parse(jsonKanbanData) : {
      todoData: [],
      inProgressData: [],
      doneData: []
    };
  } catch (error) {
    console.error('Error loading KanbanData:', error);
    return {
      todoData: [],
      inProgressData: [],
      doneData: []
    };
  }
};

type KanbanData = {
  todoData: Item[],
  inProgressData: Item[],
  doneData: Item[]
}

type Item = {
  key: string;
  label: string;
  backgroundColor: string;
  listId: string; // Add this property
};



interface AddTaskButtonProps {
  onPress: () => void;
}

export default function App() {


  const initialListData: Item[] = [];
  const initialItem = { key: '', label: '', backgroundColor: "", listId: "" }
  const initialKanbanData = {
    todoData: [],
    inProgressData: [],
    doneData: []
  }

  const [kanbanData, setKanbanData] = useState<KanbanData>(initialKanbanData);
  const [activeList, setActiveList] = useState<string | null>(null);



  const [currentItem, setCurrentItem] = useState<Item>(initialItem)
  const [currentListId, setCurrentListId] = useState('')
  const [currentTaskLabel, setCurrentTaskLabel] = useState('')

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);



  const fetchData = async () => {
    const data = await loadKanbanDataFromStorage()
    setKanbanData(data)
  }

  useEffect(() => {
    fetchData();
  }, []);


  const handleAddTask = (taskData: Item) => {
    let formattedData: Item[] = []
    let newKanbanData: KanbanData = initialKanbanData
    switch (taskData.listId) {
      case 'todoData':
        formattedData = [taskData, ...kanbanData.todoData]
        newKanbanData = { ...kanbanData, todoData: formattedData }
        setKanbanData(newKanbanData);
        break;
      case 'inProgressData':
        formattedData = [taskData, ...kanbanData.inProgressData]
        newKanbanData = { ...kanbanData, inProgressData: formattedData }
        setKanbanData(newKanbanData);
        break;
      case 'doneData':
        formattedData = [taskData, ...kanbanData.doneData]
        newKanbanData = { ...kanbanData, doneData: formattedData }
        setKanbanData(newKanbanData);
        break;
      default:
        break;
    }
    console.log("kanbandata:", newKanbanData)
    setIsAddModalVisible(false);
    saveKanbanDataToStorage(newKanbanData)
  };

  const editTask = (fromList: Item[], toList: Item[], taskKey: string, fromListName: string, toListName: string, taskData: Item) => {

    const taskIndex = fromList.findIndex(task => task.key === taskKey);
    if (taskIndex !== -1) {
      const movedTask = fromList.splice(taskIndex, 1)[0];
      toList = [taskData, ...toList]


      const newKanbanData = { ...kanbanData, [fromListName]: fromList, [toListName]: toList }
      setKanbanData(newKanbanData)
      saveKanbanDataToStorage(kanbanData)
    }
  };

  const handleDragEnd = (data: Item[], listId: string) => {
    const updatedData = data.map((item) => ({
      ...item,
      listId: listId,
    }));
    const formattedData = { ...kanbanData, [listId]: updatedData }
    saveKanbanDataToStorage(formattedData)

    return formattedData;
  };

  const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onPress }) => {
    return (
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    );
  };

  const EditTaskButton: React.FC<AddTaskButtonProps> = ({ onPress }) => {
    return (
      <TouchableOpacity style={{...styles.button, backgroundColor: "#042A2B"}} onPress={onPress}>
        <Text style={styles.buttonText}>Edit Task</Text>
      </TouchableOpacity>
    );
  };

  function Header({ text, type }: { text: string, type: string }) {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text
            style={{
              fontSize: 30,
              color: 'black',
              marginRight: 10,
            }}>
            {text}
          </Text>
          <AddTaskButton  onPress={() => { setIsAddModalVisible(true); setCurrentListId(type); }} />
        </View>
      </View>
    );
  }

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Item>) => {
    const isActiveForColumn = isActive && activeList === item.listId;

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={() => {
            drag();
            setActiveList(item.listId);
          }}
          disabled={isActiveForColumn}
          style={[
            styles.rowItem,
            { backgroundColor: isActiveForColumn ? "yellow" : item.backgroundColor },
          ]}
        >
          <View style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <Text style={[styles.text, styles.textContainer, {maxWidth: 300}]}>{item.label}</Text>
            <EditTaskButton onPress={() => { setIsEditModalVisible(true); setCurrentItem(item); }} />

          </View>




        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "seashell" }}>
      <NestableScrollContainer style={{ backgroundColor: "seashell" }}>
        <AddTask
          isVisible={isAddModalVisible}
          onClose={() => setIsAddModalVisible(false)}
          onSave={handleAddTask}
          listId={currentListId}
        />
        <EditTask
          isVisible={isEditModalVisible}
          onClose={() => setIsEditModalVisible(false)}
          onSave={editTask}
          currentItem={currentItem}
          kanbanData={kanbanData}
        />
        <Header text={"TO DO"} type={"todoData"} />
        <NestableDraggableFlatList
          style={{ minHeight: 170 }}
          data={kanbanData.todoData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          onDragEnd={({ data }) => {
            setKanbanData(handleDragEnd(data, "todoData"));
            setActiveList(null);
          }}
        />

        <Header text={"IN PROGRESS"} type={"inProgressData"} />
        <NestableDraggableFlatList
          style={{ minHeight: 170 }}
          data={kanbanData.inProgressData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          onDragEnd={({ data }) => {
            setKanbanData(handleDragEnd(data, "inProgressData"));
            setActiveList(null);
          }}
        />

        <Header text={"DONE"} type={"doneData"} />

        <NestableDraggableFlatList
          style={{ minHeight: 170 }}
          data={kanbanData.doneData}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          onDragEnd={({ data }) => {
            setKanbanData(handleDragEnd(data, "doneData"));
            setActiveList(null);
          }}
        />
      </NestableScrollContainer>
    </GestureHandlerRootView>
  );
}




const styles = StyleSheet.create({
  rowItem: {
    height: 100,
    justifyContent: "center",
    border: "solid",
    borderWidth: 0.7,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    paddingLeft: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});