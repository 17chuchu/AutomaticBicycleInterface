import ReconnectingWebSocket from 'reconnecting-websocket';

class SocketManager
{
    static client = undefined

    static url = 'undefined'
    static handlenewurl = undefined

    static initialize(ip,port)
    {
        SocketManager.client = new ReconnectingWebSocket('ws://'+ ip +':' + port + '/');
        SocketManager.client.addEventListener('open', () => {
            console.log("Connection Succeeded")
        });

        SocketManager.client.addEventListener('message', (res) => {
            console.log(res.data)
            if(res.data == 'undefined')
            {
                return
            }
            else if(!(SocketManager.handlenewurl === undefined))
            {
                if(!(SocketManager.url == res.data))
                {
                    SocketManager.handlenewurl(res.data)
                    SocketManager.url = res.data
                }
            }

        });

    }
}


export default SocketManager