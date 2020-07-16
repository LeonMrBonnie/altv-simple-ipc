import * as alt from "alt-server";
import uuid from "uuid";

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
     * Sends an event to the player and returns the response
     *
     * @author LeonMrBonnie
     * @static
     * @param {alt.Player} player
     * @param {String} event
     * @param {Boolean} timeout
     * @param {Array} args
     * @returns {Promise}
     * @memberof IPC
     */
    static async send(player, event, withTimeout, ...args) {
        return new Promise((resolve, reject) => {
            let id = uuid.v4();
            alt.emitClient(player, `ipc:receive`, id, event, ...args);
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
     * @param {(player: alt.Player, ...args)} handler
     * @memberof IPC
     */
    static receive(event, handler) {
        IPC._events[event] = handler;
    }

    static async receiveHandler(player, id, event_name, ...args) {
        let event = IPC._events[event_name];
        if (!event) return;
        let result = await event(player, ...args);
        alt.emitClient(player, `ipc:response`, id, result);
    }
    static responseHandler(player, id, result) {
        let response = IPC._responses[id];
        if (!response) return;
        if (response.timeout) alt.clearTimeout(response.timeout);
        response.resolve(result);
    }
}

alt.onClient("ipc:receive", IPC.receiveHandler);
alt.onClient("ipc:response", IPC.responseHandler);
