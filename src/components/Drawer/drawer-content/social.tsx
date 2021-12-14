import { SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as GitHub } from "../../../assets/icons/github.svg";
import { ReactComponent as Twitter } from "../../../assets/icons/twitter.svg";
import { ReactComponent as Telegram } from "../../../assets/icons/telegram.svg";
import { ReactComponent as Discord } from "../../../assets/icons/discord.svg";
import { ReactComponent as Medium } from "../../../assets/icons/medium.svg";

export default function Social() {
    return (
        <div className="social-row">
            <Link href="https://twitter.com/Spicy_DAO" target="_blank">
                <SvgIcon color="primary" component={Twitter} />
            </Link>

            <Link href="https://discord.gg/spicy" target="_blank">
                <SvgIcon color="primary" component={Discord} />
            </Link>

            {/* <Link href="https://t.me/spicydao" target="_blank">
                <SvgIcon viewBox="0 0 32 32" color="primary" component={Telegram} />
            </Link>

            <Link href="https://github.com/Traverse-money" target="_blank">
                <SvgIcon color="primary" component={GitHub} />
            </Link>

            <Link href="https://home.spicydao.finance/#" target="_blank">
                <SvgIcon color="primary" component={Medium} />
            </Link> */}
        </div>
    );
}
