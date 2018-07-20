import React, { Component } from 'react';
import { Container,Col, Row } from 'reactstrap';
import './App.css';

import uuidv1 from 'uuid/v1'
import SimpleWebRTC from 'simplewebrtc'
import ReactDOM from 'react-dom'
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

        //const capsule = new Capsule()
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
            url: 'http://localhost:8888'
        });
        this.pubrtc.on('videoAdded', this.addPublisher);
        this.pubrtc.on('videoRemoved', this.removePublisher);
        this.pubrtc.joinRoom(this.pubid);
        console.log("Publisher Launch on room:",pubid);

        this.subid = subid
        this.setState({})
    }

    addPublisher = async (video, peer) => {
        console.log("Publisher found")
        //  console.log(this.refs.remotes);
        var remotes = ReactDOM.findDOMNode(this.refs.remotes);
        console.log(video);
        if (remotes) {
            var container = document.createElement('div');
            container.style.transform = 'rotateY(-180deg)'
            container.className = 'videoContainer';
            container.id = 'container_' + this.pubrtc.getDomId(peer);
            container.appendChild(video);
            // suppress contextmenu
            video.oncontextmenu = function() {
                return false;
            };
            video.height = 100
            video.muted = true
            console.log(container);
            remotes.appendChild(container);
            this.pubelement = video;


            this.subrtc = new SimpleWebRTC({
                url: 'http://localhost:8888',
            });
            this.subrtc.localVideoEl = this.pubelement
            this.subrtc.joinRoom(this.subid);
            console.log(this.pubelement)
            console.log("Subscriber Launch on room:",this.subid)
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
                <video id="localVideo"></video>
            </div>
        )
    }
}

export default App;
