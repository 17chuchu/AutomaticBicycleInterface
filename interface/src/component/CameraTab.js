import React from "react"
import { Player } from 'video-react';
import "/Users/slimshady23/GitHubProject/AutomaticBicycleInterface/interface/node_modules/video-react/dist/video-react.css";

import SwitchAnimation from '../component/lottie/SwitchAnimation'

import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'


import {
     TabPane, Fade
} from 'reactstrap';

class CameraTab extends React.Component
{
    remotesource = undefined

    static tabRef = undefined

    state = {
        hasvideo: false
    }

    constructor(props)
    {
        super(props)
        CameraTab.tabRef = this
    }

    componentDidMount() {
        this.webrtc = new SimpleWebRTC({
            url: 'http://10.2.1.172:8888'
        });
        this.webrtc.on('videoAdded', this.addVideo);
        this.webrtc.on('videoRemoved', this.removeVideo);

        console.log("webrtc component mounted");
    }

    addVideo = async (video, peer) => {
        if(!this.state.hasvideo) {
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
                video.oncontextmenu = function () {
                    return false;
                };
                video.width = 800
                video.muted = true
                console.log(container);
                remotes.appendChild(container);
            }
            this.webrtc.mute()
            this.setState({hasvideo: true})
        }
    }

    removeVideo = async(video, peer) => {
        var remotes = ReactDOM.findDOMNode(this.refs.remotes);
        var el = document.getElementById(peer ? 'container_' + this.webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    }

    readyToCall = async () => {
        console.log("Connect to room");
        return this.webrtc.joinRoom('5abd2cc7-1f76-4ac9-858b-d55c085cb77b');
    }

    disconnectCall = async () => {
        console.log("Disconnect from room");
        return this.webrtc.leaveRoom();
    }




    render()
    {
        return(
            <TabPane tabId="CameraTab">
                <SwitchAnimation readyToCall={this.readyToCall} disconnectCall={this.disconnectCall}/>
                <Fade className={"CameraTabContainer"}in={this.props.active == "CameraTab"} id = "remoteVideos" ref = "remotes">
                    <div
                        className = "remotes"
                        id = "remoteVideos"
                        ref = "remotes" >
                    </div>
                </Fade>
            </TabPane>
        );
    }
}


export default CameraTab