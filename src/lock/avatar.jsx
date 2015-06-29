import React from 'react';
import { md5 } from 'blueimp-md5';
import EmailCredentials from './credentials/email';

export default class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._deriveState(this.props.email);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.email != nextProps.email) {
      this._deriveState(nextProps.email);
    }
  }

  render() {
    var placeholder = <div className="auth0-lock-header-logo"/>;
    var gravatar = <img className="auth0-lock-header-avatar animated fadeInDown" src={this.state.url}/>;
    return this.state.isValid ? gravatar : placeholder;
  }

  _deriveState(email) {
    email = EmailCredentials.validateEmail(email);
    if (email) {
      let url = `https://www.gravatar.com/avatar/${md5(email)}?d=404`
      this.setState({isValid: null, url: url});

      // TODO we should be caching this stuff
      // TODO we should be issuing a regular request, there is no need to use an
      // img element.
      let img = document.createElement("img");
      img.addEventListener("load", () => {
        if (this.state.url === url) {
          this.setState({isValid: true});
        }
      });
      img.addEventListener("error", () => {
        if (this.state.url === url) {
          this.setState({isValid: false});
        }
      });
      img.src = url;
    } else {
      this.setState({isValid: false, url: ""})
    }
  }
}

Avatar.propTypes = {
  email: React.PropTypes.string
};