import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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

    constructor(props) {
        super(props);
    }

    componentDidMount()
    {
        this.OV = new OpenVidu()
        this.session = this.OV.initSession()
        // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
        // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
        this.session.connect(OPENVIDU_SERVER_URL, { clientData: "asdfasdf" })
            .then(() => {
                // --- 6) Get your own camera stream with the desired properties ---

                var publisher = this.OV.initPublisher('remoteVideos', {// The source of audio. If undefined default microphone
                    videoSource: undefined, // The source of video. If undefined default webcam
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
        });

    }

    render() {
        return (
            <Router>
                <div>
                    <div
                        className = "remotes"
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




