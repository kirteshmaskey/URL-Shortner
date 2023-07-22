import React, { useState } from "react";

const URLShortener = () => {
  const [mainURL, setMainURL] = useState("");
  const [shortURL, setShortURL] = useState("");
  const BASE_URL = "http://127.0.0.1:8000";

  const shortenURL = async () => {
    // make API call to node server to shorten URL
    const response = await fetch(BASE_URL + "/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: mainURL }),
    });
    const data = await response.json();
    setShortURL(data.shortURL);
  };

  const copyShortURL = () => {
    navigator.clipboard.writeText(shortURL);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>URL Shortener</h1>
      <input
        type="text"
        placeholder="Enter URL"
        value={mainURL}
        required
        onChange={(e) => setMainURL(e.target.value)}
      />
      &nbsp;
      <button onClick={shortenURL}>Shorten</button>
      {shortURL && (
        <>
          <p>Short URL: {shortURL}</p>
          <button onClick={copyShortURL}>Copy</button>
        </>
      )}
    </div>
  );
};

export default URLShortener;
