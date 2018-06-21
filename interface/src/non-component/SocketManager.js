import ReconnectingWebSocket from 'reconnecting-websocket';

class SocketManager
{
    static client = undefined
    static token = undefined

    static handlelogin = undefined

    static activitycode = {
        default :   0,
        login   :   1
    }

    static initialize(ip,port)
    {
        SocketManager.client = new ReconnectingWebSocket('ws://'+ ip +':' + port + '/');
        SocketManager.client.addEventListener('open', () => {
            console.log("Connection Succeeded")
        });

        SocketManager.client.addEventListener('message', (res) => {
            var data = JSON.parse(res.data)
            switch(data.code) {
                case SocketManager.activitycode.login:
                    if(!(SocketManager.handlelogin === undefined))
                    {
                        SocketManager.handlelogin(JSON.parse(res.data))
                    }
                default:
                    return null;
            }
        });

    }

    static packMassage(code,data)
    {
        var pack = {code : code, pack : data}
        return JSON.stringify(pack)
    }

    static login(email,password)
    {
        var info = {email : email, password : password}
        var data = JSON.stringify(info)
        var pack = SocketManager.packMassage(SocketManager.activitycode.login,data)

        SocketManager.client.send(pack)
    }
}


export default SocketManager