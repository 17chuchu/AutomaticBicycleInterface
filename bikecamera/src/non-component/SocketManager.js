import ReconnectingWebSocket from 'reconnecting-websocket';

class SocketManager
{
    static client = undefined

    static appref = undefined
    static roomid = 'undefined'

    static initialize(ip,port)
    {
        SocketManager.client = new ReconnectingWebSocket('ws://'+ ip +':' + port + '/');
        SocketManager.client.addEventListener('open', () => {
            console.log("Connection Succeeded")
        });

        SocketManager.client.addEventListener('message', (res) => {
            if(res.data == 'undefined')
            {
                return
            }
            else
            {
                if(!(SocketManager.roomid === res.data))
                {
                    SocketManager.roomid = res.data
                    console.log(res.data)
                    console.log("Attempt calling to room:",SocketManager.roomid)
                    while(!this.appref.callToRoom(SocketManager.roomid)){}
                }
            }

        });

    }
}


export default SocketManager