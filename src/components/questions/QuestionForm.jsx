import React, {useState, useEffect} from 'react'

import {db} from '../../firebase'
import { collection, addDoc, updateDoc, doc, onSnapshot, getDoc, setDoc, arrayUnion } from 'firebase/firestore';

const QuestionForm = () => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("")
    const questionType = ['four', 'five', 'six', 'seven', 'eight', 'nine', 'ten']
    const [selectedType, setSelectedType] = useState('four');
    const [fetchedData, setFetchedData] = useState({});
    const [editData, setEditData] = useState(null);

  // Additional state for game room creation
  const [roomCode, setRoomCode] = useState('');
  const [timeLimit, setTimeLimit] = useState(10); // 10 minutes
  const [maxScore, setMaxScore] = useState(300);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [displayedQuestions, setDisplayedQuestions] = useState({});



    const questionsCollectionRef = collection(db, 'questions');
    const singleDocRef = doc(questionsCollectionRef, 'allTypes');

    useEffect(() => {
        const unsubscribe = onSnapshot(singleDocRef, (docSnapshot) => {
          if (docSnapshot.exists()) {
            setFetchedData(docSnapshot.data());
          }
        });
      
        return () => {
          unsubscribe(); // Clean up the listener on component unmount
        };
      }, []);

    const handleTypeChange = (event) => {
        setSelectedType(event.target.value);
      };

      const handleEditClick = (type, index, questionObj) => {
        setQuestion(questionObj.question);
        setAnswer(questionObj.answer);
        setSelectedType(type);
        setEditData({ type, index });
      };
    
      const handleDeleteClick = async (type, index) => {
        const docSnapshot = await getDoc(singleDocRef);
        if (docSnapshot.exists()) {
          const currentData = docSnapshot.data();
          currentData[type].splice(index, 1);
          await updateDoc(singleDocRef, currentData);
          setFetchedData(currentData);
        }
      };
    
    
      const createQuestion = async (e) => {
        e.preventDefault();
      
        const questionObject = {
          question,
          answer,
        };
      
        const docSnapshot = await getDoc(singleDocRef);
      
        if (docSnapshot.exists()) {
          const currentData = docSnapshot.data();
      
          if (editData) {
            // Remove the old question for the edit action
            currentData[editData.type].splice(editData.index, 1);
      
            // If the old array is empty, delete the key
            if (currentData[editData.type].length === 0) {
              delete currentData[editData.type];
            }
      
            // Add the updated question object to the new type array
            if (currentData[selectedType]) {
              currentData[selectedType].push(questionObject);
            } else {
              currentData[selectedType] = [questionObject];
            }
      
            setEditData(null); // Clear the edit data
          } else {
            // Check if the selectedType array exists and append the new question object
            if (currentData[selectedType]) {
              currentData[selectedType].push(questionObject);
            } else {
              // If the array doesn't exist, create it with the new question object
              currentData[selectedType] = [questionObject];
            }
          }
      
          // Update the document with the modified data
          await updateDoc(singleDocRef, currentData);
          setFetchedData(currentData);
        } else {
          // If the document doesn't exist, create it with the initial selectedType array
          await setDoc(singleDocRef, {
            [selectedType]: [questionObject],
          });
        }
      
        // Clear the form fields
        setQuestion('');
        setAnswer('');
      };

        // Modified getRandomQuestions function to update displayedQuestions state
        const getRandomQuestions = (type, count) => {
          if (!fetchedData[type]) return [];
      
          const availableQuestions = [...fetchedData[type]];
          const selected = [];
      
          for (let i = 0; i < count; i++) {
            if (availableQuestions.length === 0) break;
      
            const randomIndex = Math.floor(Math.random() * availableQuestions.length);
            selected.push(availableQuestions[randomIndex]);
            availableQuestions.splice(randomIndex, 1);
          }
      
          setDisplayedQuestions((prevState) => ({ ...prevState, [type]: selected }));
          return selected;
        };

  const createGameRoom = async (e) => {
    e.preventDefault();

    // Select 3 random questions for each selected type
    const questions = questionType.reduce((acc, type) => {
      acc[type] = getRandomQuestions(type, 3);
      return acc;
    }, {});

    const gameRoom = {
      code: roomCode,
      adminId: 'your_admin_id', // Replace with the admin's user ID
      participants: [],
      questions,
      gameState: 'waiting',
      timeLimit, // 10 minutes
      maxScore, // 300 points
      createdAt: '',
    };

    await addDoc(collection(db, 'gamerooms'), gameRoom);
  };

  const showRandomQuestions = () => {
    questionType.forEach((type) => {
      getRandomQuestions(type, 3);
    });
  };

  

    return (
        <>
        
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto mt-10">
      <form onSubmit={createQuestion} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Question</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Add question"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"

          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Answer</label>
          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Add answer"
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"

          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Select question type:</label>
          <select
            value={selectedType}
            onChange={handleTypeChange}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
          >
            {questionType.map((qT, key) => (
              <option key={key} value={qT}>
                {qT}
              </option>
            ))}
          </select>
          <p className="text-gray-600 text-xs italic">You selected: {selectedType}</p>
        </div>

        <button
          type="submit"
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
          {editData ? "Save" : "Add"}
        </button>
      </form>
    </div>
        <br></br>

        <div className="overflow-x-auto">
  <table className="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Type
        </th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Question
        </th>
        <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Answer
        </th>
        <th className="px-6 py-3 bg-gray-50"></th>
        <th className="px-6 py-3 bg-gray-50"></th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {Object.entries(fetchedData).map(([type, questions]) =>
        questions.map((questionObj, index) => (
          <tr key={`${type}-${index}`}>
            {index === 0 && (
              <td rowSpan={questions.length} className="px-6 py-4 whitespace-nowrap">
                {type}
              </td>
            )}
            <td className="px-6 py-4 whitespace-nowrap">{questionObj.question}</td>
            <td className="px-6 py-4 whitespace-nowrap">{questionObj.answer}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => handleEditClick(type, index, questionObj)}
                className="text-blue-600 hover:text-blue-900"
              >
                Edit
              </button>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <button
                onClick={() => handleDeleteClick(type, index)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>

      <br></br>

<div className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-md mx-auto mt-10'>
<form onSubmit={createGameRoom} className="space-y-4">
  <div>
    <label className="block text-sm font-medium text-gray-700">Room Code</label>
    <input
      type="text"
      value={roomCode}
      onChange={(e) => setRoomCode(e.target.value)}
      placeholder="Set room code"
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
    />
  </div>
  <button
    type="submit"
    className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
    >
    Create Game Room
  </button>
</form>

{/* Buttons to display random questions for each selectedType */}
<div className="flex flex-wrap gap-2 mt-4">
  {questionType.map((type, index) => (
    <button
      key={index}
      onClick={() => getRandomQuestions(type, 3)}
      className="group w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-orange-700 bg-orange-100 hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
      >
      Random {type}
    </button>
  ))}
</div>

{/* Render the displayedQuestions */}
<div className="mt-6 space-y-4">
  {Object.entries(displayedQuestions).map(([type, questions]) => (
    <div key={type}>
      <h3 className="text-lg font-semibold">{type}</h3>
      <ul className="list-disc list-inside space-y-1">
        {questions.map((question, index) => (
          <li key={`${type}-${index}`}>
            {question.question} - {question.answer}
          </li>
        ))}
      </ul>
    </div>
  ))}
</div>
</div>


      
        </>
    )

}


export default QuestionForm