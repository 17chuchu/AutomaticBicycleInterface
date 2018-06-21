import React from "react"
import {
    Card ,CardTitle, CardText, CardHeader
    , Button
    , Fade
    , Form, FormGroup, Label, Col, Input
} from 'reactstrap';

class UserCard extends React.Component
{
    state = {
        logincardmargin : "10px"
    }

    setmargin = async (margin) =>
    {
        this.setState({
            logincardmargin: margin
        })
    }

    constructor(props)
    {
        super(props)
    }

    render()
    {
        return(
            <Fade in={true}>
                <Card body className="text-center" style={{width: "200px", float: "right", marginRight: this.state.logincardmargin, marginTop: "10px", backgroundColor: "#fcf6e5"}}>
                    <CardTitle>Username</CardTitle>
                    <CardText>With supporting text below as a natural lead-in to additional content.</CardText>
                    <Button style = {{backgroundColor : "#3d8c95", borderColor: "#3d8c95", shadowColor: "#3d8c95"}}>Logout</Button>
                </Card>
            </Fade>
        )
    }

}


export default UserCard;