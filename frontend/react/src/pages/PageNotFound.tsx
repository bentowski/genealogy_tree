import { Component } from "react";
import "../styles/pages/pagenotfound.css"

class PageNotFound extends Component {
    render(): JSX.Element {
        return (
            <div className="pageNotFound">
                <h1>Page Not Found</h1>
                <div id="background-wrap">
                    <div className="gary"></div>
                </div>
            </div>
        );
    }
}
export default PageNotFound;