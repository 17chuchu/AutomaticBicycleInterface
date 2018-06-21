import React from "react"
import { Player } from 'video-react';
import "/Users/slimshady23/GitHubProject/AutomaticBicycleInterface/interface/node_modules/video-react/dist/video-react.css";

import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'


import {
     TabPane, Fade
} from 'reactstrap';

class CameraTab extends React.Component
{
    remotesource = undefined

    constructor(props)
    {
        super(props)
    }

    componentDidMount() {
        this.webrtc = new SimpleWebRTC({
            autoRequestMedia: true,
            url: 'http://localhost:8888'
        });
        this.webrtc.on('videoAdded', this.addVideo);
        this.webrtc.on('videoRemoved', this.removeVideo);
        this.webrtc.on('readyToCall', this.readyToCall);

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
        return this.webrtc.joinRoom('12345');
    }




    render()
    {
        return(
            <TabPane tabId="CameraTab">
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