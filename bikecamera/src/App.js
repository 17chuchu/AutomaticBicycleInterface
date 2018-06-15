import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'



class App extends React.Component {

    webrtc = undefined

    constructor(props) {
        super(props);
        this.addVideo = this.addVideo.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.readyToCall = this.readyToCall.bind(this);
    }
    componentDidMount() {
        this.webrtc = new SimpleWebRTC({
            localVideoEl: ReactDOM.findDOMNode(this.refs.local),
            remoteVideosEl: "",
            autoRequestMedia: true,
            url: 'http://localhost:8888'
        });
        this.webrtc.on('videoAdded', this.addVideo);
        this.webrtc.on('videoRemoved', this.removeVideo);
        this.webrtc.on('readyToCall', this.readyToCall);

        console.log("webrtc component mounted");
    }

    addVideo(video, peer) {
        console.log('video added', peer);
        //  console.log(this.refs.remotes);
        var remotes = ReactDOM.findDOMNode(this.refs.remotes);
        console.log(remotes);
        if (remotes) {
            var container = document.createElement('div');
            container.className = 'videoContainer';
            container.id = 'container_' + this.webrtc.getDomId(peer);
            container.appendChild(video);
            // suppress contextmenu
            video.oncontextmenu = function() {
                return false;
            };
            console.log(container);
            remotes.appendChild(container);
        }
        this.webrtc.mute()
    }

    removeVideo(video, peer) {
        console.log('video removed ', peer);
        var remotes = ReactDOM.findDOMNode(this.refs.remotes);
        var el = document.getElementById(peer ? 'container_' +       this.webrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    }

    readyToCall() {
        return this.webrtc.joinRoom('12345');
    }

    render() {
        return (
            <div>
                <button onClick={this.readyToCall}>join</button>
                <video className = "local"
                    id = "localVideo"
                    ref = "local" >
                </video>
                <div
                    className = "remotes"
                    id = "remoteVideos"
                    ref = "remotes" >
                </div>
            </div>
        );
    }
}

export default App;