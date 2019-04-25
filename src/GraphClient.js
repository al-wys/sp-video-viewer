import { Client } from "@microsoft/microsoft-graph-client";

let _graphClient = null;

export function initGraphClientWithAutuProvider(authProvider) {
    _graphClient = Client.initWithMiddleware({ authProvider });
}

export function getGraphClient() {
    return _graphClient;
}