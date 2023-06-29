import React, { useState } from "react";
import axios from "axios";
import MonacoEditor from "react-monaco-editor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { backendURL } from "./backendURL";

const App = () => {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("");
  const [convertedCode, setConvertedCode] = useState("");
  const [debuggedCode, setDebuggedCode] = useState("");
  const [qualityResult, setQualityResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setNotification("");
  };

  const resetApp = () => {
    setCode("");
    setLanguage("");
    setConvertedCode("");
    setDebuggedCode("");
    setQualityResult("");
    setNotification("");
  };

  const convertCode = async () => {
    if (!language) {
      setNotification("Please select a language.");
      return;
    }

    try {
      setIsLoading(true);
      setConvertedCode("");
      setDebuggedCode("");
      setQualityResult("");

      const response = await axios.post(`${backendURL}/convert`, {
        code,
        language,
      });
      setConvertedCode(response.data.convertedCode);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const debugCode = async () => {
    try {
      setIsLoading(true);
      setConvertedCode("");
      setDebuggedCode("");
      setQualityResult("");
      setNotification("");

      const response = await axios.post(`${backendURL}/debug`, { code });
      setDebuggedCode(response.data.debuggedCode);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkCodeQuality = async () => {
    try {
      setIsLoading(true);
      setConvertedCode("");
      setDebuggedCode("");
      setQualityResult("");
      setNotification("");

      const response = await axios.post(`${backendURL}/quality`, { code });
      setQualityResult(response.data.qualityResult);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="editor-container">
        <MonacoEditor
          height="300"
          language="javascript"
          theme="vs-dark"
          value={code}
          onChange={handleCodeChange}
        />
      </div>

      <div className="options-container">
        <select value={language} onChange={handleLanguageChange}>
          <option value="" disabled>
            Select Language
          </option>
          <option value="Python">Python</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option>
        </select>

        <button onClick={convertCode}>Convert</button>
        <button onClick={debugCode}>Debug</button>
        <button onClick={checkCodeQuality}>Check Quality</button>
        <button onClick={resetApp}>Reset</button>
      </div>

      {isLoading && (
        <div className="loading-container">
          <FontAwesomeIcon icon={faSpinner} spin />
          <span>Loading...</span>
        </div>
      )}

      {notification && (
        <div className="notification-container">
          <span>{notification}</span>
        </div>
      )}

      {convertedCode && (
        <div className="output-container">
          <h3>Converted Code</h3>
          <pre>{convertedCode}</pre>
        </div>
      )}

      {debuggedCode && (
        <div className="output-container">
          <h3>Debugged Code</h3>
          <pre>{debuggedCode}</pre>
        </div>
      )}

      {qualityResult && (
        <div className="output-container">
          <h3>Code Quality Check Result</h3>
          <pre>{qualityResult}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
