import * as alt from "alt";
import ipc from "PATH/TO/ipc.mjs"; // Change to your own path!!

// First argument is always the player, all of the following arguments are those specified by the player
// You can either return like in a normal function, or return a promise (async) both works
ipc.receive("testmessage", (player, message) => {
  return new Promise((resolve) => {
    alt.log(`Received message ${message} from ${player.name}`);
    // Wait 3 seconds and respond
    alt.setTimeout(() => resolve("Hello back!"), 3000);
  });
});
