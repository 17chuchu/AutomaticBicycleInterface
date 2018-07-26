import React from "react"

import Titles from "./component/SearchBike"
import RealtimeTab from "./component/RealtimeTab"
import CameraTab from "./component/CameraTab"
import SearchBike from "./component/SearchBike"
import BlockUi from 'react-block-ui';
import SocketManager from './non-component/SocketManager';

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-block-ui/style.css';


import {
    Nav, NavItem
    , Dropdown, DropdownItem, DropdownToggle, DropdownMenu
    , NavLink
    , Container
    , Row, Col
    , TabContent, TabPane
    , Button
    , Collapse
    , Modal, ModalHeader, ModalBody, ModalFooter
    , Badge
    , Card ,CardTitle, CardText
} from 'reactstrap';
import AuthenticationSet from "./component/authentication/AuthenticationSet";




class App extends React.Component
{
    myip = 'localhost'
    port = 7001

    searchbike = React.createRef();
    cameratab = React.createRef();
    authenticationset = React.createRef();

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
        selectedbike: "Search your bike.",
        loginTog: false,
        loginButtonDisable: false,

        collapsesearch: false,
        isOnline: false
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

        SocketManager.initialize(this.myip,this.port)
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

    donothingfunction = async () => {}

    toggleOnline = async (status) => {
        if(!status) {
            this.cameratab.current.forceswitchOff()
        }
        this.setState({isOnline: status})
    }

    toggleLogin = async () => {
        this.setState({loginTog: !this.state.loginTog})
    }

    setLoginButton = async (state) =>
    {
        this.setState({loginButtonDisable : state})
    }

    toggleCollapse = async () =>{
        this.setState({ collapsesearch: !this.state.collapsesearch });
    }

    forceCollapse = async () => {
        this.setState({ collapsesearch: false });
    }

    setBikeId = async (id) =>
    {
        this.setState({selectedbike : id})
        SocketManager.selectedBike = id
        SocketManager.checkbike(id)
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
                <div className="loginTheme">
                    <Button color="secondary"  onClick={!this.state.loginButtonDisable ? this.toggleLogin : this.donothingfunction} style = {{ height : "45px", width : "200px",color: "#509f98",backgroundColor: "#fcf6e5" ,fontWeight: "500", fontSize : "20px",marginTop: "10px", marginRight: "10px",float : "right",  textDecoration: 'none'}} >visitor</Button>
                    <AuthenticationSet loginTog = {this.state.loginTog} toggleLogin = {this.toggleLogin} setBikeId = {this.setBikeId} setLoginButton = {this.setLoginButton} forceCollapse={this.forceCollapse}/>
                </div>
                <p className="App-intro">App-Name</p>
                <SearchBike ref={this.searchbike} bikeid = {this.state.selectedbike} setBikeId={this.setBikeId} addBikeId={this.addBikeId} removeBikeId={this.removeBikeId} allBike={this.state.allBikeId} toggleCollapse={this.toggleCollapse} collapsesearch={this.state.collapsesearch} toggleOnline={this.toggleOnline}/>
                <Collapse isOpen={this.state.isOnline}>
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
                                ref={this.cameratab}
                                active = {this.state.activeTab}
                            />
                        </TabContent>
                    </BlockUi>
                </Collapse>
            </div>
        );
    }


};



export default App;



