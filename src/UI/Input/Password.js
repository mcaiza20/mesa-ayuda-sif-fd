import React, { Component } from "react";
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { TextInputField } from 'evergreen-ui'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Input.css'
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


class PasswordShowHide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: true,
      icon: faEyeSlash

    };

    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.toggleShow = this.toggleShow.bind(this);
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  toggleShow() {
    if (this.state.hidden)
      this.setState({ hidden: !this.state.hidden, icon: faEye });
    else
      this.setState({ hidden: !this.state.hidden, icon: faEyeSlash });
  }

  componentDidMount() {
    if (this.props.password) {
      this.setState({ password: this.props.value });
    }
  }

  render() {
    return (
      <div>
        <Row>

          <Col xs={10} md={11} style={{ paddingRight: '0px' }}>
            <TextInputField
              type={this.state.hidden ? "password" : "text"}
              value={this.props.value}
              onChange={this.props.change}
              label={''}
              disabled={this.props.disabled}
            />
          </Col>
          <Col xs={2} md={1} style={{ paddingLeft: '0px' }}>
            
              <Button className='botonContra' style={{
                width: '100%',
                padding: '0px',
                borderTop: '1px',
                marginTop: '4px',
                textAlign: 'center'
              }}
                onClick={this.toggleShow}> <FontAwesomeIcon icon={this.state.icon} /> </Button>

          </Col>
        </Row>



      </div>
    );
  }
}

export default PasswordShowHide;
