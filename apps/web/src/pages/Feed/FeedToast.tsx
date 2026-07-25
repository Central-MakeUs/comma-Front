import { Link } from "react-router-dom";
import { Icon } from "@comma/design-system";
import * as styles from "./FeedToast.css";

function FeedToast() {
    return (
        <div className={styles.headerContainer}>
            <span className={styles.headerText}>
            오늘 아직 쉬지 못했어요.
            <br />
            잠깐 쉼표 찍으러 갈까요?
            </span>
            <Link className={styles.headerLink} to="/rest/checklist">
            휴식하기 <Icon name="rightArrow" />
            </Link>
        </div>
    );
}

export default FeedToast;