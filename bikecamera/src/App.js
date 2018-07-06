import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'

import $ from 'jquery';

import { OpenVidu, Session, Stream } from 'openvidu-browser';

const OPENVIDU_SERVER_URL = "https://" + window.location.hostname + ":4443";

function getToken(mySessionId) {
    return createSession(mySessionId).then(sessionId => createToken(sessionId));
}


function createSession(sessionId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: OPENVIDU_SERVER_URL + "/api/sessions",
            data: JSON.stringify({ customSessionId: sessionId }),
            headers: {
                "Authorization": "Basic " + btoa("OPENVIDUAPP:MY_SECRET"),
                "Content-Type": "application/json"
            },
            success: response => resolve(response.id),
            error: (error) => {
                if (error.status === 409) {
                    resolve(sessionId);
                } else {
                    console.warn('No connection to OpenVidu Server. This may be a certificate error at ' + OPENVIDU_SERVER_URL);
                    if (window.confirm('No connection to OpenVidu Server. This may be a certificate error at \"' + OPENVIDU_SERVER_URL + '\"\n\nClick OK to navigate and accept it. ' +
                            'If no certificate warning is shown, then check that your OpenVidu Server is up and running at "' + OPENVIDU_SERVER_URL + '"')) {
                        window.location.assign(OPENVIDU_SERVER_URL + '/accept-certificate');
                    }
                }
            }
        });
    });
}

function createToken(sessionId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: OPENVIDU_SERVER_URL + "/api/tokens",
            data: JSON.stringify({ session: sessionId }),
            headers: {
                "Authorization": "Basic " + btoa("OPENVIDUAPP:MY_SECRET"),
                "Content-Type": "application/json"
            },
            success: response => resolve(response.token),
            error: error => reject(error)
        });
    });
}






class App extends React.Component {
    OV = undefined;
    session = undefined;

    mySessionId = "12345567"

    constructor(props) {
        super(props);
    }

    componentDidMount()
    {
        this.OV = new OpenVidu()
        this.session = this.OV.initSession()
        console.log(this.session)

        getToken(this.mySessionId).then(token => {

            // First param is the token got from OpenVidu Server. Second param can be retrieved by every user on event
            // 'streamCreated' (property Stream.connection.data), and will be appended to DOM as the user's nickname
            console.log("The token is : \n" +token)
            this.session.connect("wss://localhost:4443?sessionId=12345567&token=tosqgsdqxdxknx9h&role=PUBLISHER", { clientData: "asdfasdf" })
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

                })
                .catch(error => {
                    console.log('There was an error connecting to the session:', error.code, error.message);
                });
        });
    }

    render() {
        return (
            <div>
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




