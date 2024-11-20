import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from "react-native";

export default function HomeScreen({ route }) {
    const [flashbacks, setFlashbacks] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [showAnswer, setShowAnswer] = useState(false);
    const [selectedFlashbackIndex, setSelectedFlashbackIndex] = useState(null); // Track selected flashback

    // GET DATA FROM STORAGE ----------------------------------------------------------------
    useEffect(() => {
        const fetchFlashbacks = async () => {
            try {
                const flashbacksJSON = await AsyncStorage.getItem("flashbacks");
                setFlashbacks(flashbacksJSON ? JSON.parse(flashbacksJSON) : []);
            } catch (error) {
                console.error("Error fetching flashbacks:", error);
            }
        };
        fetchFlashbacks();
    }, []);

    const revealAnswer = (answer, index) => {
        setSelectedAnswer(answer);
        setSelectedFlashbackIndex(index);
        setShowAnswer(false);  // Reset showAnswer to hide answer initially
        setModalVisible(true);
    };

    const handleConfirmation = async (isCorrect) => {
        setModalVisible(false);
        if (selectedFlashbackIndex !== null) {
            const updatedFlashbacks = [...flashbacks];
            if (isCorrect) {
                updatedFlashbacks[selectedFlashbackIndex].days += 1; // Increment days if correct
            } else {
                updatedFlashbacks[selectedFlashbackIndex].days = 0;  // Reset days if incorrect
            }
            setFlashbacks(updatedFlashbacks);
            await AsyncStorage.setItem("flashbacks", JSON.stringify(updatedFlashbacks)); // Save updated data
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.flashbacksContainer}>
                {flashbacks.map((flashback, index) => (
                    <View key={index} style={styles.flashbackItem}>
                        <Text style={styles.flashbackQuestion}>{flashback.question}</Text> 
                        <View style={{ flexDirection: "row" }}>
                            <Text style={styles.flashbackDays}>{flashback.days} Days</Text>
                            <TouchableOpacity 
                                style={styles.answerButton} 
                                onPress={() => revealAnswer(flashback.answer, index)}
                            >
                                <Text style={styles.answerButtonText}>Look Up Answer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Answer Modal */}
            <Modal
                transparent={true}
                animationType="fade"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Show "Reveal Answer" button or the answer text */}
                        {showAnswer ? (
                            <>
                                <Text style={styles.confirmationText}>Is this your answer?</Text>
                                <Text style={styles.modalAnswerText}>{selectedAnswer}</Text>
                               
                                <View style={styles.confirmationButtons}>
                                    <TouchableOpacity 
                                        style={styles.confirmButton} 
                                        onPress={() => handleConfirmation(true)}
                                    >
                                        <Text style={styles.confirmButtonText}>Yes, it is</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={styles.declineButton} 
                                        onPress={() => handleConfirmation(false)}
                                    >
                                        <Text style={styles.declineButtonText}>No, it wasn't</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={styles.revealButton}
                                onPress={() => setShowAnswer(true)}
                            >
                                <Text style={styles.revealButtonText}>Reveal Answer</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity 
                            style={styles.closeButton} 
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        marginTop: 50,
        backgroundColor: "#f5f5f5",
    },
    flashbacksContainer: {
        flex: 1,
        width: "100%",
    },
    flashbackItem: {
        backgroundColor: "#ffffff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    flashbackQuestion: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    flashbackDays: {
        color: "white",
        fontWeight: "bold",
        borderRadius: 8,
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "black",
        width: '40%',
    },
    answerButton: {
        marginTop: 10,
        marginLeft: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "#007AFF",
        borderRadius: 8,
        width: 'auto',
    },
    answerButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    modalAnswerText: {
        fontSize: 24,
        color: "#333",
        marginBottom: 20,
        textAlign: "center",
        fontStyle: "italic"
    },
    confirmationText: {
        fontSize: 20,
        color: "#333",
        marginVertical: 10,
        textAlign: "center",
        fontWeight: "bold"
    },
    confirmationButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
    },
    confirmButton: {
        backgroundColor: "green",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    declineButton: {
        backgroundColor: "red",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    confirmButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    declineButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
    revealButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 20,
    },
    revealButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    closeButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    closeButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },
});
