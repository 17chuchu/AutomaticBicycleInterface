import React, { Component } from 'react';
import { Container,Col, Row } from 'reactstrap';
import './App.css';

import uuidv1 from 'uuid/v1'
import SimpleWebRTC from 'simplewebrtc'
import attachMediaStream from 'attachmediastream';
import ReactDOM from 'react-dom'
import {Button
} from 'reactstrap';
import SocketManager from "./NonComponent/SocketManager";

class App extends Component {

    constructor(props) {
        super(props)
        SocketManager.handlenewroom = this.createNewRoom
        SocketManager.initialize('localhost','7100')
    }

    createNewRoom = async (bikeid) => {
        var capsule = React.createRef()
        ReactDOM.render(
            <Capsule id = {bikeid} ref={capsule}/>,
            document.getElementById('contain')
        );
        capsule.current.initializeRTC(SocketManager.subscriber[bikeid],SocketManager.publisher[bikeid])
    }

    render()
    {
        return (
            <div ref="contain" id="contain">

            </div>
        )
    }
}


class Capsule extends Component
{
    subid = undefined
    subrtc = undefined
    subelement = undefined

    pubid = undefined
    pubrtc = undefined
    pubelement = undefined

    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }

    initializeRTC = async (subid, pubid) => {
        this.pubid = pubid
        this.pubrtc = new SimpleWebRTC({
            url: 'http://141.44.17.141:8888'
        });
        this.pubrtc.on('videoAdded', this.addPublisher);
        this.pubrtc.on('videoRemoved', this.removePublisher);
        console.log("Publisher Launch on room:",pubid);
        this.pubrtc.joinRoom(this.pubid);

        this.subid = subid
        this.subrtc = new SimpleWebRTC({
            localVideoEl: ReactDOM.findDOMNode(this.refs.localVideo),
            url: 'http://141.44.17.141:8080',
        });
        this.subrtc.on('readyToCall',this.readyToCall)
        console.log("Subscriber Launch on room:",this.subid)
        this.setState({})
    }

    readyToCall = async () => {
        console.log('This is ready')
    }

    addPublisher = async (video, peer) => {
        console.log("Publisher found")
        //  console.log(this.refs.remotes);
        var remotes = ReactDOM.findDOMNode(this.refs.remotes);
        if (remotes) {
            var container = document.createElement('div');
            container.style.transform = 'rotateY(-180deg)'
            container.className = 'videoContainer';
            container.id = 'container_' + this.pubrtc.getDomId(peer);
            container.appendChild(video);
            video.oncontextmenu = function() {
                return false;
            };
            video.height = 100
            video.muted = true
            console.log(container);
            remotes.appendChild(container);
            this.pubelement = attachMediaStream(peer.stream);

            this.subrtc.webrtc.localStreams.push(this.pubelement.srcObject)
            this.subrtc.joinRoom(this.subid)
            this.subrtc.mute()
        }
        this.pubrtc.mute()
    }

    removePublisher = async(video, peer) => {
        console.log('video removed ', peer);
        var remotes = ReactDOM.findDOMNode(this.refs.remotes);
        var el = document.getElementById(peer ? 'container_' + this.pubrtc.getDomId(peer) : 'localScreenContainer');
        if (remotes && el) {
            remotes.removeChild(el);
        }
    }

    render()
    {
        return (
            <div>
                <div ref="remotes" className="VideoBox"> <p1 className="TextBox">{this.pubid}</p1> </div>
                <video ref="localVideo"></video>
            </div>
        )
    }
}

export default App;
