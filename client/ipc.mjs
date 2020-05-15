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
     * Sends an event to the server and returns the response
     *
     * @author LeonMrBonnie
     * @static
     * @param {String} event
     * @param {Array} args
     * @returns {Promise}
     * @memberof IPC
     */
    static async send(event, ...args) {
        return new Promise((resolve, reject) => {
            let response = function(...args) {
                alt.clearTimeout(timeout);
                alt.offServer(`ipc:${event}:response`, response);
                resolve(...args);
            }
            alt.emitServer(`ipc:${event}`, ...args);
            alt.onServer(`ipc:${event}:response`, response);
            let timeout = alt.setTimeout(() => {
                alt.offServer(`ipc:${event}:response`, response);
                reject();
            }, this._timeout);
        });
    }
    /**
     * Receives an event from the server
     *
     * @author LeonMrBonnie
     * @static
     * @param {String} event
     * @param {Function} handler
     * @memberof IPC
     */
    static receive(event, handler) {
        let receiver = async function(...args) {
            let result = await handler(...args);
            alt.emitServer(`ipc:${event}:reponse`, result);
        }
        alt.onServer(`ipc:${event}`, receiver);
    }
}
