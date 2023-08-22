import React, { useState } from 'react';
import { Modal, Text, Pressable, TextInput, View, StyleSheet } from 'react-native';
import v4 from "react-native-uuid-generator"

type Item = {
  key: string;
  label: string;
  backgroundColor: string;
  listId: string; // Add this property
};

interface TaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: (TaskData: Item) => void;
  listId: string;
}

const AddTask: React.FC<TaskModalProps> = ({ isVisible, onClose, onSave, listId }) => {
  const [taskName, setTaskName] = useState('');

  const handleSave =  async () => {

    const taskData = {key: await v4.getRandomUUID(), label: taskName, backgroundColor: "white", listId: listId}
    onSave(taskData);
    setTaskName('');
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add Task</Text>
          <TextInput
            style={styles.input}
            placeholder="Coloque o nome da tarefa"
            value={taskName}
            onChangeText={text => setTaskName(text)}
          />
          <Pressable style={[styles.button, styles.buttonClose]} onPress={handleSave}>
            <Text style={styles.textStyle}>Add Task</Text>
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

export default AddTask;