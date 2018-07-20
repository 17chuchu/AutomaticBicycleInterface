import React from "react"

import SwitchAnimation from '../component/lottie/SwitchAnimation'

import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'


import $ from 'jquery';
import uuidv1 from 'uuid/v1'



import {
     TabPane, Fade
} from 'reactstrap';
import SocketManager from "../non-component/SocketManager";




class CameraTab extends React.Component
{

    webrtc = undefined
    isReady = false

    state = {
        switchlock: false
    }

    constructor(props)
    {
        super(props)
        SocketManager.handleaskforvideo = this.handleReceiveRoomId
    }

    componentDidMount() {
        this.webrtc = new SimpleWebRTC({
            url: 'http://localhost:8888'
        });
        this.webrtc.on('videoAdded', this.addVideo);
        this.webrtc.on('videoRemoved', this.removeVideo);

        console.log("webrtc component mounted");
    }

    addVideo = async (video, peer) => {
        console.log('video added', peer);
        //  console.log(this.refs.remotes);
        var remotes = ReactDOM.findDOMNode(this.refs.remotes);
        console.log(video);
        if (remotes) {
            var container = document.createElement('div');
            container.style.transform = 'rotateY(-180deg)'
            container.className = 'videoContainer';
            container.id = 'container_' + this.webrtc.getDomId(peer);
            container.appendChild(video);
            // suppress contextmenu
            video.oncontextmenu = function() {
                return false;
            };
            video.width = 800
            video.muted = true
            console.log(container);
            remotes.appendChild(container);
        }
        this.webrtc.mute()
    }

    removeVideo = async(video, peer) => {
        console.log('video removed ', peer);
        var remotes = ReactDOM.findDOMNode(this.refs.remotes);
        var el = document.getElementById(peer ? 'container_' +       this.webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    }

    readyToCall = async () => {
        console.log("Connect to room");
        this.isReady = true;
    }

    disconnectCall = async () => {
        console.log("Disconnect from room");
        return this.webrtc.leaveRoom();
    }

    beginToCall = async () => {
        SocketManager.askforvideo(SocketManager.selectedBike)
    }

    handleReceiveRoomId = async (info) => {
        console.log(info)
        return this.webrtc.joinRoom(info.pack.bikeid);
    }

    render()
    {
        return(
            <TabPane tabId="CameraTab">
                <SwitchAnimation readyToCall={this.beginToCall} disconnectCall={this.disconnectCall} isLock={this.state.switchlock}/>
                <Fade className="CameraTabContainer" in={this.props.active == "CameraTab"} ref = "remotes">
                    <div
                        className="videoContainer"
                        id = "remoteVidd"
                        ref = "remotes" >
                    </div>
                </Fade>
            </TabPane>
        );
    }
}


export default CameraTab
