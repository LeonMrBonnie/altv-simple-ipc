import * as alt from "alt";

export default class IPC {
    /**
     * IPC event timeout delay
     *
     * @static
     * @memberof IPC
     */
    static _timeout = 15000;

    /**
     * Sends an event to the player and returns the response
     *
     * @author LeonMrBonnie
     * @static
     * @param {alt.Player} player
     * @param {String} event
     * @param {Array} args
     * @returns {Promise}
     * @memberof IPC
     */
    static async send(player, event, args) {
        return new Promise((resolve, reject) => {
            let response = function(...args) {
                alt.offClient(`ipc:${event}:reponse`, response);
                resolve(...args);
            }
            alt.emitClient(player, `ipc:${event}`, ...args);
            alt.onClient(`ipc:${event}:response`, response);
            alt.setTimeout(() => {
                alt.offClient(`ipc:${event}:response`, response);
                reject();
            }, this._timeout);
        });
    }

    /**
     * Receives an event from the client
     *
     * @author LeonMrBonnie
     * @static
     * @param {String} event
     * @param {Function} handler
     * @memberof IPC
     */
    static receive(event, handler) {
        let receiver = async function(player, ...args) {
            let result = await handler(player, ...args);
            alt.emitClient(player, `ipc:${event}:response`, result);
        }
        alt.onClient(`ipc:${event}`, receiver);
    }
}
