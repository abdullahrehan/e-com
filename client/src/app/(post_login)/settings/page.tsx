import React, { useState } from "react";

function page() {
  const [number, setNumber] = useState(0);
  let a=5;
  const url = "https://example.com/api/endpoint";
  let Url = "https://example.com/api/endpoint";

  

  return (
    <>
      <h1>Settings</h1>
      <p>Settings page</p>
      <p>Number: {number}</p>
      <button onClick={() => setNumber(number + 1)}>Increment</button>
      <button onClick={() => setNumber(number - 1)}>Decrement</button>
      <button onClick={() => setNumber(0)}>Reset</button>
    </>
  );
}

export default page;
