import React, { useState } from "react";
import "./header.scss";
import { ReactComponent as WonderlandIcon } from "../../../../assets/icons/wonderland-icon.svg";
import { SvgIcon, Link, Box, Popper, Fade } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../../../assets/icons/github.svg";
import { ReactComponent as Twitter } from "../../../../assets/icons/twitter.svg";
import { ReactComponent as Telegram } from "../../../../assets/icons/telegram.svg";
import { ReactComponent as Discord } from "../../../../assets/icons/discord.svg";

function Header() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event: any) => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const open = Boolean(anchorEl);

    return (
        <div className="landing-header">
            <SvgIcon color="primary" component={WonderlandIcon} viewBox="0 0 394 107" style={{ minWidth: 174, minHeight: 50 }} />
            <div className="landing-header-nav-wrap">
                <Box component="div" onMouseEnter={e => handleClick(e)} onMouseLeave={e => handleClick(e)}>
                    <p className="landing-header-nav-text">Social</p>
                    <Popper className="landing-header-poper" open={open} anchorEl={anchorEl} transition>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={200}>
                                <div className="tooltip">
                                    <Link className="tooltip-item" href="https://twitter.com/Spicy_DAO" target="_blank">
                                        <SvgIcon color="primary" component={Twitter} />
                                        <p>Twitter</p>
                                    </Link>
                                    <Link className="tooltip-item" href="https://discord.gg/spicy" target="_blank">
                                        <SvgIcon color="primary" component={Discord} />
                                        <p>Discord</p>
                                    </Link>
                                    {/* <Link className="tooltip-item" href="https://t.me/traversemoney" target="_blank">
                                        <SvgIcon viewBox="0 0 32 32" color="primary" component={Telegram} />
                                        <p>Telegram</p>
                                    </Link>
                                    <Link className="tooltip-item" href="https://github.com/Traverse-money" target="_blank">
                                        <SvgIcon color="primary" component={GitHub} />
                                        <p>GitHub</p>
                                    </Link>
                                    <Link className="tooltip-item" href="https://medium.com/@traverse.money" target="_blank">
                                        <SvgIcon color="primary" component={Medium} />
                                        <p>Medium</p>
                                    </Link> */}
                                </div>
                            </Fade>
                        )}
                    </Popper>
                </Box>
            </div>
        </div>
    );
}

export default Header;
