import * as alt from "alt";
import ipc from "PATH/TO/ipc.mjs"; // Change to your own path!!

(async() => {
  try {
    let message = await ipc.send("testmessage", "Hello");
    alt.log(message); // Prints: 'Hello back!'
  }
  catch(e) {
    // The response has timed out, display a error message
  }
})(); // IIFE, so we can use async
