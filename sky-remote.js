#!/usr/bin/env node

var net = require('net');
// var args = process.argv.splice(1);
var args = ["power", "115".split('')];
var ip = "www.mcgrewal.com";
var port = 49160;
var commands = args;
var remoteControl = new SkyRemote(ip, port);

SkyRemote.SKY_Q = 5900;
SkyRemote.commands = {
    power: 0,
    select: 1,
    backup: 2,
    dismiss: 2,
    channelup: 6,
    channeldown: 7,
    interactive: 8,
    sidebar: 8,
    help: 9,
    services: 10,
    search: 10,
    tvguide: 11,
    home: 11,
    i: 14,
    text: 15,
    up: 16,
    down: 17,
    left: 18,
    right: 19,
    red: 32,
    green: 33,
    yellow: 34,
    blue: 35,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    9: 57,
    play: 64,
    pause: 65,
    stop: 66,
    record: 67,
    fastforward: 69,
    rewind: 71,
    boxoffice: 240,
    sky: 241
};

remoteControl.press(commands);

function SkyRemote(host, port)
{
    function sendCommand(code, cb)
    {
        var commandBytes = [0x4, 0x1, 0x0, 0x0, 0x0, 0x0, Math.floor(224 + (code / 16)), code % 16];
        var client = net.connect({
            host: host,
            port: port
        });

        var l = 12;
        client.on('data', function (data)
        {
            // Clear timeout
            if (data.length < 24)
            {
                client.write(data.slice(0, l))
                l = 1;
            }
            else
            {
                client.write(new Buffer.from(commandBytes), function ()
                {
                    commandBytes[1] = 0;
                    client.write(new Buffer.from(commandBytes), function ()
                    {
                        client.destroy();
                        cb(null)
                    });
                });
            }
        });
    }

    this.press = function press(sequence, cb)
    {
        if (typeof sequence !== 'object' || !sequence.hasOwnProperty('length'))
        {
            return press(sequence.split(','), cb)
        }
        sendCommand(SkyRemote.commands[sequence.shift()], function ()
        {
            if (sequence.length)
            {
                // setTimeout(function ()
                // {
                press(sequence, cb);
                // }, 0);
            }
            else
            {
                if (typeof cb === 'function')
                {
                    cb();
                }
            }
        });
    }
}