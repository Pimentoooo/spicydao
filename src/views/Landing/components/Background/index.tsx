import React from "react";
import "./background.scss";
import landingback from "../../../../assets/icons/landing.jpg";

function Background() {
    return (
        <div className="landing-background">
            <div className="landing-background-blobs-top">
                <img src={landingback} id="myVideo"/>
            </div>
        </div>
    );
}

export default Background;
