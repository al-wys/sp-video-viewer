import React from 'react';

import { UserAgentApplication } from 'msal'
import { MSALAuthenticationProvider } from "@microsoft/microsoft-graph-client/lib/src/MSALAuthenticationProvider";

export default class Auth extends React.Component {
    constructor(props) {
        super(props);

        this._userAgentApplication = new UserAgentApplication(props.appId, props.authority || null, (errorDesc, token, error, _tokenType) => {
            if (!token) {
                console.error(`${error}:${errorDesc}`);
            }
        });

        this.state = {
            isSignedIn: -1
        };

        this._userAgentApplication.acquireTokenSilent(props.scopes)
            .then(() => this.setState({ isSignedIn: 1 }))
            .catch(() => this.setState({ isSignedIn: 0 }));
    }

    render() {
        switch (this.state.isSignedIn) {
            case 1:
                return <button id='btnSignOut'>Sign Out - {this._userAgentApplication.getUser().name}</button>;
            case 0:
                return <button id='btnSignIn'>Sign In</button>;
            default:
                return <div></div>;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        this.setEvent();

        if (this.state.isSignedIn === 1 && this.state.isSignedIn !== prevState.isSignedIn) {
            if (this.props.onAuthProviderChanged) {
                this.props.onAuthProviderChanged(new MSALAuthenticationProvider(this.props.appId, this.props.scopes));
            }

            if (this.props.onSignedIn) {
                this.props.onSignedIn();
            }
        }
    }

    // componentDidMount() {
    //     this.setEvent();
    // }

    setEvent() {
        const that = this;

        if (this.state.isSignedIn === 1) {
            document.querySelector('#btnSignOut').addEventListener('click', function () {
                that._userAgentApplication.logout();
                that.setState({ isSignedIn: 0 });
            });
        }

        if (this.state.isSignedIn === 0) {
            document.querySelector('#btnSignIn').addEventListener('click', function () {
                that._userAgentApplication.loginPopup(that._scopes).then(() => that.setState({ isSignedIn: 1 }));
            });
        }
    }
}