import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Modal, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

//C-@@ Console logs

//C-0X General Variables
//C-1X Add Flashback
//C-2X Edit Flashback
//C-3X Delete Flashback
//C-4X Display Flashback

export default function ConfigScreen({ route }) {
    //C-00 VARIABLES
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    
    //Edit and alter states
    const [edit, setEdit] = useState(false);
    const [editIndex, setEditIndex] = useState(null);
    const [deleteIndex, setDeleteIndex] = useState(null);

    //Popup variables
    const [listVisible, setListVisible] = useState(false);
    const [deleteVisible, setDeleteVisible] = useState(false);
    
    //Flashback array
    const [flashbacks, setFlashbacks] = useState([]);
  
    //C-01 GET DATA FROM STORAGE 
    useEffect(() => {
        // Reads all of the data from a json item
        // and converts it into an array of dictionaries
        // with the variables: question, answer, and days.
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

    //C-10 ADD FLASHBACK POPUP START UP 
    const addFlashback = () => {
        setListVisible(true); //for listFlashback modal
        // Tells the app to use the popup for adding a NEW Flashback
        setEdit(false);
        
        //And resets the input fields
        setQuestion("");
        setAnswer("");
    };

    //C-20 EDIT FLASHBACK EDIT START UP
    const editFlashback = (index) => {
        //Reads and gets the variables it needs
        const flashback = flashbacks[index];

        //Fills in the paramters
        setQuestion(flashback.question);
        setAnswer(flashback.answer);
        setEditIndex(index);

        //Tells the app to use the pop up to EDIT a Flashback
        setEdit(true);
        setListVisible(true); //for listFlashback modal
    };

    //C-11  ADD/EDIT FUNCTION 
    //C-21  Postfunction for addFlashback() and editFlashback()
    const listFlashback = async () => {
        // Check either the question or answer is empty
        if (!question.trim() || !answer.trim()) {
            Alert.alert("Invalid Input", "Both question and answer fields must be filled out.");
            return;
        }
    
        try {
            //C-21 EDIT 
            //Checks both the edit state and the editIndex to avoid any errors.
            //Days are always defaulted to 0 after adding or editing 
            if (edit && editIndex !== null) {
                // Take all the previous flashbacks
                const updatedFlashbacks = [...flashbacks];
    
                // Modify the flashback with the editIndex
                // and upload it to the useState
                updatedFlashbacks[editIndex] = { question, answer, days: 0 };
                await AsyncStorage.setItem("flashbacks", JSON.stringify(updatedFlashbacks));
                setFlashbacks(updatedFlashbacks);
            } 
            // C-11 ADD 
            else {
                const newFlashback = { question, answer, days: 0 };
    
                // Make a new list with all the previous flashbacks with the new one 
                // and upload it to the useState
                const updatedFlashbacks = [...flashbacks, newFlashback];
                await AsyncStorage.setItem("flashbacks", JSON.stringify(updatedFlashbacks));
                setFlashbacks(updatedFlashbacks);
            }
    
            // Empty the input fields
            setQuestion("");
            setAnswer("");
    
            // Empty the parameters
            setListVisible(false);
            setEdit(false);
            setEditIndex(null);
    
            // C-@@ Print flashbacks
            console.log(flashbacks);
        } catch (error) {
            console.error("Error saving flashbacks:", error);
        }
    };       
   
    
    
    //C-30 DELETE FLASHBACK 
    // Pre-function for deleteFlashback()
    const confirmDelete = (index) => {
        //Opens up flashback and opens up the delete pop up
        //with the delete function and its index
        setDeleteIndex(index);
        setDeleteVisible(true);
    };

    //C-31 DELETE FUNCTION
    const deleteFlashback = async () => {
        try {
            //Deletes the flashback from the array
            const updatedFlashbacks = flashbacks.filter((_, i) => i !== deleteIndex);
            await AsyncStorage.setItem("flashbacks", JSON.stringify(updatedFlashbacks));

            //Updates the flashbacks
            setFlashbacks(updatedFlashbacks);

            //Resets the parameters
            setDeleteIndex(null);
            setDeleteVisible(false);
        } catch (error) {
            console.error("Error deleting flashback:", error);
        }
    };


    return (
        <View style={styles.container}>
            {/*C-10 Add Button */}
            <TouchableOpacity style={styles.addButton} onPress={addFlashback}>
                <Icon name="add-circle-outline" size={24} color="#007AFF" />
                <Text style={styles.buttonText}>Add Flashback</Text>
            </TouchableOpacity>

            {/*C-40 Item List */}
            <ScrollView style={styles.flashbacksContainer}>
                {flashbacks.map((flashback, index) => (
                    // C- 41 Flashback item
                    <View key={index} style={styles.flashbackItem}>
                        {/* Question and Day */}
                        <Text style={styles.flashbackQuestion}>{flashback.question}</Text>
                        <Text style={styles.flashbackDays}>{flashback.days} Days</Text>

                        {/* Buttons Row Delete and Edit */}
                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <TouchableOpacity onPress={() => editFlashback(index)}>
                                <Icon name="create-outline" size={26} color="#007AFF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => confirmDelete(index)}>
                                <Icon name="close-outline" size={26} color="#FF3B30" style={{ marginLeft: 25 }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/*C-11  Add modal */}
            {/*C-21  Edit modal*/}
            <Modal
                transparent={true}
                animationType="slide"
                visible={listVisible}
                onRequestClose={() => setListVisible(false)}>
                    
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* Title */}
                        <Text style={styles.label}>{edit ? "Edit Flashback" : "Add Flashback"}</Text>

                        {/* Question and Answer Input */}
                        <TextInput
                            style={styles.input}
                            value={question}
                            onChangeText={setQuestion}
                            placeholder="Enter question"
                        />
                        <TextInput
                            style={styles.input}
                            value={answer}
                            onChangeText={setAnswer}
                            placeholder="Enter answer"
                        />

                        {/* Buttons */}
                        <View style={styles.confirmDeleteButtons}>
                            {/* OK */}
                            <TouchableOpacity style={styles.okButton} onPress={listFlashback}>
                                <Text style={styles.okButtonText}>OK</Text>
                            </TouchableOpacity>
                            
                            {/* Cancel */}
                            <TouchableOpacity style={[styles.okButton, styles.cancelButton]} onPress={() => setListVisible(false)}>
                                <Text style={styles.confirmButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View> 
            </Modal>

            {/*C-31  Delete modal*/}
            <Modal
                transparent={true}
                animationType="fade"
                visible={deleteVisible}
                onRequestClose={() => setDeleteVisible(false)}>
                
                
                <View style={styles.modalContainer}>
                    <View style={styles.confirmDeleteContent}>

                        {/* Label */}
                        <Text style={styles.confirmDeleteText}>Are you sure you want to delete this flashback?</Text>

                        {/* Buttons */}
                        <View style={styles.confirmDeleteButtons}>

                            {/* Yes Button */}
                            <TouchableOpacity style={styles.confirmButton} onPress={deleteFlashback}>
                                <Text style={styles.confirmButtonText}>Yes</Text>
                            </TouchableOpacity>

                            {/* Cancel Button */}
                            <TouchableOpacity style={[styles.confirmButton, styles.cancelButton]} onPress={() => setDeleteVisible(false)}>
                                <Text style={styles.confirmButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
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
        backgroundColor: "#f5f5f5",
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent:"flex-end",
        marginBottom: 20,
        marginTop:30
    },
    buttonText: {
        marginLeft: 5,
        color: "#007AFF",
        fontSize: 16,
        fontWeight: "bold",
    },

    // FLASHBACK CONTAINER -------------------------------
    flashbacksContainer: {
        flex: 1,
        width: "100%",
    },
    flashbackItem: {
        backgroundColor: "#ffffff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: "#ffffff",
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
        // textAlign: "center",
        borderRadius: 8,
        margin: 5,
        marginLeft : 0,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: "black",
        width: '40%'
    },
    // flashbackAnswer: {
    //     fontSize: 16,
    //     color: "#666",
    //     marginTop: 5,
    // },

    // POPUP CONTAINER 
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
    label: {
        fontSize: 16,
        marginVertical: 8,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    okButton: {
        marginTop: 15,
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    okButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    confirmDeleteContent: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    confirmDeleteText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center",
    },
    confirmDeleteButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
    },
    confirmButton: {
        backgroundColor: "#007AFF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    cancelButton: {
        backgroundColor: "#FF3B30",
    },
    confirmButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
});
