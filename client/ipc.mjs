import * as alt from "alt-client";
import uuid from "./uuid.mjs";

export default class IPC {
    /**
     * IPC event timeout delay
     *
     * @static
     * @memberof IPC
     */
    static _timeout = 15000;
    static _responses = {};

    /**
     * Sends an event to the server and returns the response
     *
     * @author LeonMrBonnie
     * @static
     * @param {String} event
     * @param {Boolean} timeout
     * @param {Array} args
     * @returns {Promise}
     * @memberof IPC
     */
    static async send(event, withTimeout, ...args) {
        return new Promise((resolve, reject) => {
            let id = uuid();
            alt.emitServer(`ipc:receive`, id, event, ...args);
            let timeout;
            if (withTimeout)
                timeout = alt.setTimeout(() => {
                    delete IPC._responses[id];
                    reject();
                }, this._timeout);
            IPC._responses[id] = {
                resolve: resolve,
                timeout: timeout,
            };
        });
    }
    static _events = {};
    /**
     * Receives an event from the client
     *
     * @author LeonMrBonnie
     * @static
     * @param {String} event
     * @param {(...args)} handler
     * @memberof IPC
     */
    static receive(event, handler) {
        IPC._events[event] = handler;
    }

    static async receiveHandler(id, event_name, ...args) {
        let event = IPC._events[event_name];
        if (!event) return;
        let result = await event(...args);
        alt.emitServer(`ipc:response`, id, result);
    }
    static responseHandler(id, result) {
        let response = IPC._responses[id];
        if (!response) return;
        if (response.timeout) alt.clearTimeout(response.timeout);
        response.resolve(result);
    }
}

alt.onServer("ipc:receive", IPC.receiveHandler);
alt.onServer("ipc:response", IPC.responseHandler);
