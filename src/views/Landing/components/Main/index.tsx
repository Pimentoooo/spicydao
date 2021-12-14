import React from "react";
import { Link } from "@material-ui/core";
import "./main.scss";
import CatImg from "../../../../assets/icons/Chershire_Cat.jpeg";

function Main() {
    return (
        <div className="landing-main">
            {/* <div className="landing-main-img-wrap">
                <img src={CatImg} alt="" />
            </div> */}
            <div className="landing-main-title-wrap">
                <p>The Multi Chain</p>
                <p>Reserve Currency</p>
            </div>
            {/* <div className="landing-main-help-text-wrap">
                <p>Financial tools to grow your wealth - stake</p>
                <p>and earn compounding interest</p>
            </div> */}
            <div className="landing-main-btns-wrap">
                <Link href="https://app.spcdao.co/" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>Enter App</p>
                    </div>
                </Link>
                <Link href="https://spcdao.gitbook.io/spcdao/" target="_blank" rel="noreferrer">
                    <div className="landing-main-btn">
                        <p>More</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}

export default Main;
