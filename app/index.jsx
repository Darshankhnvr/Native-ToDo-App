import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useTodos } from '../context/TodoContext';

export default function HomeScreen() {
  const { todos } = useTodos();

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">My Todos</Text>

      <FlatList
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link href={`/${item.id}`} asChild>
            <TouchableOpacity className="p-4 mb-2 rounded bg-gray-100">
              <Text className="text-lg">{item.title}</Text>
            </TouchableOpacity>
          </Link>
        )}
      />

      <Link href="/new" asChild>
        <TouchableOpacity className="mt-6 p-4 bg-blue-500 rounded-xl">
          <Text className="text-white text-center text-lg">Add New Todo</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
