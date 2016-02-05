/* global client, plugin, CIRCServer, CBSConnection */
/* global CMD_CONSOLE, CMD_NEED_NET */
/* global getToggle */

// PLUGIN ENVIRONMENT //

plugin.id = "network-trace";

plugin.init =
function _init(glob) {
    plugin.major = 0;
    plugin.minor = 1;
    plugin.version = plugin.major + "." + plugin.minor + " (05 Feb 2016)";
    plugin.description = "Displays network input/output inside ChatZilla. " +
    "By James Ross <chatzilla-plugins@james-ross.co.uk>.";

    plugin.cmdList = [
        ["network-trace", cmdNetworkTrace, CMD_CONSOLE | CMD_NEED_NET, "[<toggle>]"]
    ];

    return "OK";
}

plugin.enable =
function _enable() {
    plugin.cmds = client.commandManager.defineCommands(plugin.cmdList);
    plugin.traceHook = client.eventPump.addHook([
        { set: "server", type: "rawdata" }
    ],
        observeAfter(observeServerRawData),
        plugin.id + "-hook");
    CIRCServer.prototype.connect = observeAfter(CIRCServer.prototype.connect, observeAfterConnect);
    CBSConnection.prototype.sendData = observeAfter(CBSConnection.prototype.sendData, observeAfterSendData);

    return true;
}

plugin.disable =
function _disable() {
    client.commandManager.removeCommands(plugin.cmds);
    client.eventPump.removeHookByName(plugin.id + "-hook");
    CIRCServer.prototype.connect = unwrap(CIRCServer.prototype.connect);
    CBSConnection.prototype.sendData = unwrap(CBSConnection.prototype.sendData);
    return true;
}

// UTILITIES //

function observeAfter(original, wrapper) {
    var wrapped = function () {
        var rv = original ? original.apply(this, arguments) : undefined;
        try {
            wrapper.apply(this, arguments);
        } catch (ex) { }
        return rv;
    };
    wrapped[plugin.id + "-original"] = original;
    return wrapped;
}

function unwrap(wrapped) {
    return wrapped[plugin.id + "-original"] || wrapped;
}

// PLUGIN WORK //

var DisplayDummyUser = {
    TYPE: "IRCUser",
    canonicalName: "|",
    unicodeName: "|",
    name: "network-trace",
    host: "localhost"
};

function observeAfterConnect() {
    this.connection[plugin.id + "-network"] = this;
}

function observeAfterSendData(str) {
    if (this[plugin.id + "-network"] && this[plugin.id + "-network"][plugin.id + "-enabled"]) {
        this[plugin.id + "-network"].displayHere(String(str), ">>", DisplayDummyUser);
    }
}

function observeServerRawData(e) {
    if (e.destObject.parent && e.destObject.parent[plugin.id + "-enabled"]) {
        e.destObject.parent.displayHere(String(e.data), "<<", DisplayDummyUser);
    }
}

function cmdNetworkTrace(e) {
    var state = !!e.network[plugin.id + "-enabled"];
    var change = e.toggle !== null;
    if (change) {
        state = getToggle(e.toggle, state);
        e.network[plugin.id + "-enabled"] = state;
        if (state && e.network.primServ && e.network.primServ.connection) {
            e.network.primServ.connection[plugin.id + "-network"] = e.network;
        }
    }
    client.currentObject.display("Network tracing for ``" + e.network.unicodeName + "'' is " + (change ? "now " : "") + (state ? "enabled" : "disabled") + ".");
}
