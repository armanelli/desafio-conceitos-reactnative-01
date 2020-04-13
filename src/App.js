import React, { useState, useEffect } from "react";
import { SafeAreaView, View, FlatList, Text, StatusBar, StyleSheet, TouchableOpacity } from "react-native";

import api from "./services/api";

export default function App() {
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    api.get("repositories").then((response) => {
      setRepositories(response.data);
    });
  }, []);

  async function handleLikeRepository(id) {
    const response = await api.post(`repositories/${id}/like`);

    const repository = response.data;

    const oldRepositories = repositories;
    const index = oldRepositories.findIndex((r) => r.id === id);
    oldRepositories[index].likes = repository.likes;

    setRepositories([...oldRepositories]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={(repository) => repository.id}
          renderItem={({ item: repository, index }) => (
            <View style={[styles.repositoryContainer, index === 0 && styles.firstItem]}>
              <Text style={styles.repository}>{repository.title}</Text>
              <View style={styles.techsContainer}>
                {repository.techs &&
                  repository.techs.map((tech, i) => (
                    <Text key={`tech-${i}`} style={styles.tech}>
                      {tech}
                    </Text>
                  ))}
              </View>
              <View style={styles.likesContainer}>
                <Text style={styles.likeText} testID={`repository-likes-${repository.id}`}>
                  {repository.likes} {repository.likes === 1 ? "curtida" : "curtidas"}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleLikeRepository(repository.id)}
                testID={`like-button-${repository.id}`}
              >
                <Text style={styles.buttonText}>Curtir</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#7159c1",
  },
  firstItem: {
    marginTop: 15,
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  repository: {
    fontSize: 32,
    fontWeight: "bold",
  },
  techsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  tech: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 10,
    backgroundColor: "#04d361",
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: "#fff",
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likeText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  button: {
    marginTop: 10,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
    color: "#fff",
    backgroundColor: "#7159c1",
    borderRadius: 5,
    padding: 10,
  },
});
