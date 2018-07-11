import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import SocketManager from './non-component/SocketManager'

import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'

import $ from 'jquery';

import { OpenVidu, Session, Stream } from 'openvidu-browser';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

var OPENVIDU_SERVER_URL = "undefined";

const urlparam = ({ match }) => (OPENVIDU_SERVER_URL = match.url.substring(1)) || (
    <div></div>
)


class App extends React.Component {
    OV = undefined;
    session = undefined;
    url = undefined;

    constructor(props) {
        super(props);
        SocketManager.initialize('localhost','5000')
        SocketManager.handlenewurl = this.startVideo
    }

    startVideo = async (url) =>
    {
        console.log('Bigining Video Feed')
        if(this.url === url)
        {
            return
        }
        this.url = url
        this.OV = new OpenVidu()
        this.session = this.OV.initSession()
        // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
        // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname

        this.session.on('streamCreated', event =>{
            this.session.subscribe(event.stream, 'remoteVideos');
        })

        this.session.connect(url, { clientData: "bicycle" })
            .then(() => {
                // --- 6) Get your own camera stream with the desired properties ---

                var publisher = this.OV.initPublisher('remoteVideos', {// The source of audio. If undefined default microphone
                    videoSource: undefined, // The source of video. If undefined default webcam
                    audioSource: undefined,
                    publishAudio: true,  	// Whether you want to start publishing with your audio unmuted or not
                    publishVideo: true,  	// Whether you want to start publishing with your video enabled or not
                    resolution: '640x480',  // The resolution of your video
                    frameRate: 30,			// The frame rate of your video
                    insertMode: 'APPEND',	// How the video is inserted in the target element 'video-container'
                    mirror: false       	// Whether to mirror your local video or not
                });

                this.session.publish(publisher);

            }).catch(error => {
            console.log('There was an error connecting to the session:', error.code, error.message);
            SocketManager.client.send('refresh')
        });
    }

    render() {
        return (
            <Router>
                <div>
                    <div
                        id = "remoteVideos"
                        ref = "remotes" >
                    </div>
                    <Route path='/:id' component={urlparam} />
                </div>
            </Router>
        );
    }
}


export default App;




