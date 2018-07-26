import React from "react"

import {
    TabPane, Fade, Button, Collapse, Row, Col ,InputGroup ,Input, InputGroupAddon, Form, Badge
} from 'reactstrap';
import SocketManager from "../non-component/SocketManager";

class SearchBike extends React.Component
{
    state = {
        isBikeOnline: "Offline"
    }

    constructor()
    {
        super()
        SocketManager.handlecheckbike = this.handleCheckBike
    }


    addNewBikeId = async (e) =>{
        e.preventDefault()
        var bikeid = e.target.elements[0].value
        console.log(bikeid)
        this.props.addBikeId(bikeid)
        e.target.elements[0].value = ""
    }

    setBikeId = async (id) => {
        this.props.setBikeId(id)
    }

    handleCheckBike = async (info) => {
        this.setState({isBikeOnline : info.pack.isBikeOnline})
        this.props.toggleOnline(info.pack.isBikeOnline === "Online")
    }

    render()
    {
        var data = this.props.allBike;

        return([
                <div className="SearchBike-header">
                    <Button color="link" onClick={this.props.toggleCollapse} style = {{fontSize : "20px", color : "#da89a2",  textDecoration: 'none'}}>{this.props.bikeid}<Badge color={(this.state.isBikeOnline === "Online") ? "success" : "secondary"} style={{marginLeft: "15px"}}>{this.state.isBikeOnline}</Badge></Button>
                </div>,

                <Collapse isOpen = {this.props.collapsesearch}>
                    {
                        data.map(function(element,i){
                            return <EachId id = {element} setBikeId={this.props.setBikeId} removeBikeId={this.props.removeBikeId}/>
                        }, this)
                    }
                    <div className="Theme-color">
                        <Form onSubmit = {this.addNewBikeId}>
                            <InputGroup name = "inputgroup">
                                <Input name = "inputform" placeholder="new bike id" style = {{color: "#da89a2" ,backgroundColor: "#22282c", borderColor: "#da89a2", borderWidth: "3px", texthold: "#da89a2", textCoo: "#da89a2", marginLeft: "60px", marginRight: "10px",marginTop: "20px"}}/>
                                <InputGroupAddon addonType="append"><Button color="secondary" style = {{fontSize : "20px", color : "#da89a2",backgroundColor: "transparent",borderRadius: 5,borderWidth: "3px",borderColor: "#da89a2",  textDecoration: 'none', marginRight: "60px",marginTop: "20px"}}>+</Button></InputGroupAddon>
                            </InputGroup>
                        </Form>
                    </div>
                </Collapse>
            ]
        )
    }
}

class EachId extends React.Component
{
    setBikeId = async () => {
        this.props.setBikeId(this.props.id)
    }

    removeBikeId = async () => {
        this.props.removeBikeId(this.props.id)
    }

    render()
    {
        return(
            <div className="Each-id-Theme">
                <Col sm={{ size: 'auto', offset: 0 }}>
                    <Button color="link" className="Each-id-Button" onClick={this.setBikeId} style = {{fontSize : "20px", color : "#86b4c5",  textDecoration: 'none'}}>{this.props.id}</Button>
                </Col>
                <Col></Col>
                <Col sm={{ size: 'auto', offset: 0 }}>
                    <Button color="link" className="Each-id-Remove" onClick={this.removeBikeId} style = {{fontSize : "20px", color : "#86b4c5",  textDecoration: 'none'}}>X</Button>
                </Col>
            </div>
        )
    }
}


/*<Button color="link" className="Each-id-Button" onClick={this.toggleCollapse} style = {{fontSize : "20px", color : "#86b4c5",  textDecoration: 'none'}}>Search your bike.</Button>*/
/*<InputGroup>
                            <Input placeholder="username" style = {{backgroundColor: "#22282c", borderColor: "#da89a2", borderWidth: "3px", texthold: "#da89a2", textCoo: "#da89a2", marginLeft: "60px", marginRight: "10px",marginTop: "20px"}}/>
                            <InputGroupAddon addonType="append"><Button color="secondary" style = {{fontSize : "20px", color : "#da89a2",backgroundColor: "transparent",borderRadius: 5,borderWidth: "0px",  textDecoration: 'none', paddingRight: "60px",marginTop: "20px"}}>+</Button></InputGroupAddon>
                        </InputGroup>*/
export default SearchBike
