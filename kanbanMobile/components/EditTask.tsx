import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Button, StyleSheet, TextInput, Pressable } from 'react-native';

// Import RadioButtonsGroup if it's from a different source
// import RadioButtonsGroup from 'react-native-radio-buttons-group';


interface Item {
  key: string;
  label: string;
  backgroundColor: string;
  listId: string;
}

interface Option {
  label: string;
  value: string;
}

const statusOptions: Option[] = [
  { label: 'To Do', value: 'todoData' },
  { label: 'In Progress', value: 'inProgressData' },
  { label: 'Done', value: 'doneData' },
];

interface EditTaskProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (fromList: Item[], toList: Item[], taskKey: string, fromListName: string, toListName: string, taskData: Item) => void;
  currentItem: Item;
  kanbanData: {
    todoData: Item[];
    inProgressData: Item[];
    doneData: Item[];
  };
}

const EditTask: React.FC<EditTaskProps> = ({ isVisible, onClose, onSave, currentItem, kanbanData }) => {
  const [selectedValue, setSelectedValue] = useState(currentItem.listId);
  const [taskName, setTaskName] = useState('');

  const handleSave =  () => {
    const currentValue = selectedValue === undefined ? currentItem.listId : selectedValue
    setSelectedValue(currentValue)

    console.log()

    const taskData = { key: currentItem.key, label: taskName,  backgroundColor: "white", listId: selectedValue }

    let fromList: Item[] = [];
    let toList: Item[] = [];
    let fromListName = ''
    let toListName = ''
    console.log("current.listID ", currentItem)
    switch (currentItem.listId) {
        case 'todoData':
            fromList = kanbanData.todoData
            fromListName = "todoData"
            break;
        case "inProgressData":
            fromList = kanbanData.inProgressData
            fromListName = "inProgressData"
            break;
        
        case "doneData":
            fromList = kanbanData.doneData
            fromListName = "doneData"

        default:
            break;
    }


    switch (selectedValue) {
        case 'todoData':
            toList = kanbanData.todoData
            toListName = "todoData"

            break;
        case "inProgressData":
            toList = kanbanData.inProgressData
            toListName = "inProgressData"
            break;

        case "doneData":
            toList = kanbanData.doneData
            toListName = "doneData"
            break;
        default:
            break;
    }

    onSave(fromList, toList, currentItem.key, fromListName, toListName, taskData );
    setTaskName('');
    onClose()
};

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name"
            value={taskName}
            onChangeText={text => setTaskName(text)}
          />
          {statusOptions.map(option => (
            <TouchableOpacity key={option.value} onPress={() => setSelectedValue(option.value)}>
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
          <Pressable style={[styles.button, styles.buttonClose]} onPress={handleSave}>
            <Text style={styles.textStyle}>Save</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.buttonClose]} onPress={onClose}>
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    marginTop: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    padding: 8,
    marginBottom: 15,
  },
});

export default EditTask;
