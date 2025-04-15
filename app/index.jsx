import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const colorScheme = useColorScheme()

  const lightTheme = {
    background: '#ffffff',
    text: '#000000',
    inputBg: '#f2f2f2',
    buttonBg: '#007bff',
  };
  
  const darkTheme = {
    background: '#121212',
    text: '#ffffff',
    inputBg: '#1f1f1f',
    buttonBg: '#1e90ff',
  };
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todos]);

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem("TODOS", JSON.stringify(todos));
    } catch (e) {
      console.error("Saving error:", e);
    }
  };

  const loadTodos = async () => {
    try {
      const stored = await AsyncStorage.getItem("TODOS");
      if (stored) setTodos(JSON.parse(stored));
    } catch (e) {
      console.error("Loading error:", e);
    }
  };

  const addTodo = () => {
    if (todoText.trim() === "") return;
    if (editingId) {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === editingId ? { ...todo, title: todoText } : todo
        )
      );
      setEditingId(null);
    } else {
      const newTodo = {
        id: Date.now(),
        title: todoText,
        completed: false,
      };
      setTodos((prev) => [newTodo, ...prev]);
    }
    setTodoText("");
  };

  const deleteTodo = (id) => {
    Alert.alert("Delete", "Are you sure?", [
      { text: "Cancel" },
      {
        text: "Delete",
        onPress: () => {
          setTodos((prev) => prev.filter((todo) => todo.id !== id));
        },
      },
    ]);
  };

  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const editTodo = (todo) => {
    setTodoText(todo.title);
    setEditingId(todo.id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text
        style={[
          styles.todoText,
          { textDecorationLine: item.completed ? "line-through" : "none" },
        ]}
        onPress={() => toggleComplete(item.id)}
      >
        {item.title}
      </Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => editTodo(item)}>
          <Text style={styles.edit}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deleteTodo(item.id)}>
          <Text style={styles.delete}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={styles.heading}>📋 ToDo List</Text>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter a task..."
          style={styles.input}
          value={todoText}
          onChangeText={setTodoText}
        />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>
            {editingId ? "Update" : "Add"}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#f2f2f2",
  },
  heading: {
    color:'white',
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderColor: "#888",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1e90ff",
    paddingHorizontal: 15,
    justifyContent: "center",
    marginLeft: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  todoItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: {
    fontSize: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  edit: {
    marginRight: 10,
    fontSize: 18,
  },
  delete: {
    fontSize: 18,
  },
});
