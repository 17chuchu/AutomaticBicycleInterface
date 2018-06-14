import React from "react"

import {
     TabPane, Fade
} from 'reactstrap';

class RealtimeTab extends React.Component
{
    render()
    {
        return(
            <TabPane tabId="RealtimeTab">
                <Fade in={this.props.active == "RealtimeTab"}>
                    <h4>RealtimeTab</h4>
                </Fade>
            </TabPane>
        );
    }
}


export default RealtimeTab