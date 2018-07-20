import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'
import SocketManager from "./non-component/SocketManager";



class App extends React.Component {

    rtcready = false

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        SocketManager.appref = this
        SocketManager.initialize('localhost','7110')
        this.webrtc = new SimpleWebRTC({
            localVideoEl: ReactDOM.findDOMNode(this.refs.localref),
            autoRequestMedia: true,
            url: 'http://localhost:8888',
            autoplay: true
        });
        this.webrtc.on('readyToCall',this.readyToCall)
        this.webrtc.on('createdPeer', this.createdPeer);
        console.log("webrtc component mounted");
    }

    readyToCall = async () => {
        this.rtcready = true
        console.log("Ready To Join")
    }

    callToRoom = async (roomid) => {
        if(this.rtcready) {
            this.webrtc.leaveRoom()
            this.webrtc.joinRoom(roomid, this.joinRoomCallback);
            console.log("Call to room :",roomid)
            return true
        }
        return false
    }

    joinRoomCallback = async (err, roomDescription) =>
    {
        //this.allid.
        //console.log(this.webrtc.getPeers())
    }

    createdPeer = async (peer) => {
        //if(peer )
        //this.allid.append(peer)
    }

    render() {
        return (
            <div>
                <button onClick={this.readyToCall}>join</button>
                <video id="localVideo" ref="localref"></video>
            </div>
        );
    }
}

export default App;