import ReconnectingWebSocket from 'reconnecting-websocket';

class SocketManager
{
    static client = undefined
    static token = undefined
    static loginUser = undefined

    static selectedBike = undefined
    static isBikeOnline = "Offline"

    static handlelogin = undefined
    static handlecheckbike = undefined

    static activitycode = {
        default :   0,
        login   :   1,
        checkbike:  2,
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
                    var info = JSON.parse(res.data)

                    SocketManager.token = info.comment
                    SocketManager.loginUser = JSON.parse(info.info)

                    if(!(SocketManager.handlelogin === undefined))
                    {
                        SocketManager.handlelogin(info)
                    }

                case SocketManager.activitycode.checkbike:
                    var info = JSON.parse(res.data)

                    SocketManager.selectedBike = info.pack.bikeid
                    SocketManager.isBikeOnline = info.pack.isBikeOnline

                    if(!(SocketManager.handlecheckbike === undefined))
                    {
                        SocketManager.handlecheckbike(info)
                    }
                default:
                    return null;
            }
        });

    }

    static packMassage(code,data)
    {
        const pack = {code : code, pack : data}
        return JSON.stringify(pack)
    }

    static login(email,password)
    {
        const info = {email : email, password : password}
        const data = JSON.stringify(info)
        const pack = SocketManager.packMassage(SocketManager.activitycode.login,data)

        SocketManager.client.send(pack)
    }

    static checkbike(id)
    {
        const info = {bikeid : id}
        const data = JSON.stringify(info)
        const pack = SocketManager.packMassage(SocketManager.activitycode.checkbike,data)
        SocketManager.client.send(pack)

    }
}


export default SocketManager