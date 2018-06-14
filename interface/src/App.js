import React from "react"

import Titles from "./component/SearchBike"
import RealtimeTab from "./component/RealtimeTab"
import CameraTab from "./component/CameraTab"
import SearchBike from "./component/SearchBike"
import Success from "./component/lottie/Success";
import BlockUi from 'react-block-ui';
import ReconnectingWebSocket from 'reconnecting-websocket';

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-block-ui/style.css';


import {
    Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu, NavLink, Container, Row, Col, TabContent, TabPane, Button, Collapse, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';




class App extends React.Component
{
    myip = 'localhost'
    port = 7000
    /*client = new ReconnectingWebSocket('ws://'+ this.myip +':' + this.port + '/');*/

    static = {
        activeNavItem: "App-nevItem-active",
        inactiveNavItem: "App-nevItem-inactive",
        allTab: ["RealtimeTab","CameraTab"]
    }

    state = {
        selectedNavItem: 0,
        dropdownOpen: false,
        navitemstatus: [this.static.activeNavItem,this.static.inactiveNavItem,this.static.inactiveNavItem],
        allBikeId: [],

        activeTab: "RealtimeTab",
        selectedbike: "Search your bike."
    }

    constructor(props)
    {
        super(props)
        document.body.style = 'background: #22282C;';

        var num = 1;
        while(!(localStorage.getItem('bikeappnum' + num) === null || localStorage.getItem('bikeappnum' + num) === "null"))
        {
            this.state.allBikeId.push(localStorage.getItem('bikeappnum' + num))
            num += 1
        }
        this.setState({
            allBikeId: this.state.allBikeId
        })
        /*
        this.client.addEventListener('open', () => {
            console.log("Successful connection to host: " + this.myip)
        });
        */

    }

    toggleNavItem = async (num) =>
    {
        this.state.navitemstatus[this.state.selectedNavItem] = this.static.inactiveNavItem
        this.state.navitemstatus[num] = this.static.activeNavItem
        this.state.selectedNavItem = num
        this.setState({
            navitemstatus: this.state.navitemstatus,
            activeTab: this.static.allTab[num]
        })
    }

    setBikeId = async (id) =>
    {
        this.setState({selectedbike : id})
    }

    addBikeId = async (id) =>
    {
        this.state.allBikeId.push(id)
        localStorage.setItem('bikeappnum' + this.state.allBikeId.length,id)
        console.log(this.state.allBikeId)
        this.setState({
            allBikeId: this.state.allBikeId
        })
    }

    removeBikeId = async (id) =>
    {
        var index = this.state.allBikeId.indexOf(id)
        if(index != -1)
        {
            localStorage.setItem('bikeappnum' + this.state.allBikeId.length,null)
            this.state.allBikeId.splice(index,1)
        }
        this.setState(this.state.allBikeId)
    }



    render()
    {
        let status = this.state.navitemstatus
        return (
            <div className="Theme-color">
                <p className="App-intro">App-Name</p>
                <SearchBike bikeid = {this.state.selectedbike} setBikeId={this.setBikeId} addBikeId={this.addBikeId} removeBikeId={this.removeBikeId} allBike={this.state.allBikeId} />
                <Nav pills className = "App-nev-custom">
                    <NavItem className="App-nevButton-custom">
                        <NavLink href="#" className= {status[0]} onClick={() => { this.toggleNavItem(0); }} >information</NavLink>
                    </NavItem>
                    <NavItem className="App-nevButton-custom">
                        <NavLink href="#" className= {status[1]} onClick={() => { this.toggleNavItem(1); }} >camera</NavLink>
                    </NavItem>
                    <NavItem className="App-nevButton-custom">
                        <NavLink href="#" className= {status[2]} onClick={() => { this.toggleNavItem(2); }} >others</NavLink>

                    </NavItem>
                </Nav>
                <BlockUi tag="div" blocking={false}>
                    <TabContent activeTab={this.state.activeTab}>
                        <RealtimeTab
                            active = {this.state.activeTab}
                        />
                        <CameraTab
                            active = {this.state.activeTab}
                        />
                    </TabContent>
                </BlockUi>
            </div>
        );
    }


};



export default App;



