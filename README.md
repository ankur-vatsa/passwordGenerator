# Password Generator Web Application

![image](https://github.com/user-attachments/assets/e6a13c33-762d-40f1-8c42-c7f13c0afef6)


## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [How to Use](#how-to-use)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Password Generator is a user-friendly web application designed to help users create strong, secure passwords tailored to their needs. With customizable options and real-time feedback on password strength, this application enhances online security in a simple and effective way.

## Features

- **Customizable Password Criteria**: Choose password length and include/exclude character types such as uppercase letters, lowercase letters, numbers, and special characters.
- **Real-Time Password Strength Evaluation**: Immediate feedback on password strength, displayed dynamically with color changes.
- **Password History**: Maintains a history of the last three generated passwords, complete with timestamps for easy reference.
- **Responsive Design**: Built to ensure compatibility across various devices and screen sizes.

## Technologies Used

- HTML
- CSS
- JavaScript

## How to Use

1. Clone the repository:
   ```bash
   git clone https://github.com/ankur-vatsa/passwordGenerator.git
   ```
2. Open `index.html` in your web browser.
3. Select your desired password criteria.
4. Click on the "Generate Password" button to create a password.
5. View the password strength and history below the input fields.

## Contributing

Contributions are welcome! If you have suggestions for improvements or features, please open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.




import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";

interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
}

interface AnswerRecord {
  user_id: string;
  quiz_id: number;
  question_id: number;
  selected_option: string;
  time_taken: number; // in seconds
}

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 min = 300 sec
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Fetch quiz questions
  useEffect(() => {
    fetch("/quiz_questions.json")
      .then((res) => res.json())
      .then((data: Question[]) => {
        const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 5);
        setQuestions(shuffled);
        setStartTime(Date.now());
      });
  }, []);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentIndex];
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    const record: AnswerRecord = {
      user_id: user.user_id,
      quiz_id: currentQuestion.quiz_id,
      question_id: currentQuestion.id,
      selected_option: selectedOption,
      time_taken: timeTaken,
    };

    setAnswers((prev) => [...prev, record]);
    setSelectedOption("");
    setStartTime(Date.now());

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit([...answers, record]);
    }
  };

  const handleSubmit = (finalAnswers = answers) => {
    console.log("Final submission:", finalAnswers);
    // you can POST finalAnswers to backend API here
    navigate("/results", { state: { results: finalAnswers } });
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  if (!questions.length) return <p>Loading questions...</p>;

  const current = questions[currentIndex];

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Quiz</h2>
        <span className="font-semibold text-red-500">Time Left: {formatTime(timeLeft)}</span>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium">
          Q{currentIndex + 1}. {current.question_text}
        </h3>
        <div className="mt-3 space-y-2">
          {current.options.map((option, idx) => (
            <label key={idx} className="block">
              <input
                type="radio"
                name={`q${current.id}`}
                value={option}
                checked={selectedOption === option}
                onChange={() => handleOptionSelect(option)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        {currentIndex < questions.length - 1 ? (
          <button
            onClick={handleNext}
            disabled={!selectedOption}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => handleSubmit()}
            disabled={!selectedOption}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
