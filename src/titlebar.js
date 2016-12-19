import React, { Component } from 'react';

const KEYCODE_ALT = 18;

export default class Titlebar extends Component {
  static propTypes = {
    isFullscreen: React.PropTypes.bool,
    isMaximized: React.PropTypes.bool,
    onClose: React.PropTypes.func,
    onFullscreen: React.PropTypes.func,
    onMaximize: React.PropTypes.func,
    onMinimize: React.PropTypes.func,
    platform: React.PropTypes.oneOf(['win32', 'darwin'])
  }

  static defaultProps = {
    isFullscreen: false,
    isMaximized: false,
    onClose: () => {},
    onMaximize: () => {},
    onMinimize: () => {},
    onFullscreen: () => {},
    platform: 'darwin'
  }

  state = {
    altDown: false
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isFullscreen !== this.props.isFullscreen ||
           nextState.altDown !== this.state.altDown;
  }

  componentWillUnMount() {
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  handleKeyDown = (e) => {
    if (e.keyCode === KEYCODE_ALT) {
      this.setState({ altDown: true });
    }
  }

  handleKeyUp = (e) => {
    if (e.keyCode === KEYCODE_ALT) {
      this.setState({ altDown: false });
    }
  }

  handleMaximize = () => {
    this.props.onMaximize();
  }

  handleClose = () => {
    this.props.onClose();
  }

  handleMinimize = () => {
    this.props.onMinimize();
  }

  handleMaximizeOrFullscreen = (e) => {
    if (e.altKey) {
      this.props.onMaximize();
    } else {
      this.props.onFullscreen();
    }
  }

  buildStoplight() {
    let maxOrFullIcon;
    if (this.props.isFullscreen) {
      maxOrFullIcon = (
        <svg className="titlebar__fullscreen-svg" x="0px" y="0px" viewBox="0 0 20 20">
          <path d="M8.7,10H1l9,8.8v-7.5C9.3,11.2,8.7,10.7,8.7,10z" />
          <path d="M11.3,10H19l-9-8.8v7.5C10.7,8.8,11.3,9.3,11.3,10z" />
        </svg>
      );
    } else if (this.state.altDown) {
      maxOrFullIcon = (
        <svg className="titlebar__maximize-svg" x="0px" y="0px" viewBox="0 0 20 20">
          <polygon points="17.5,9 11,9 11,2.5 9,2.5 9,9 2.5,9 2.5,11 9,11 9,17.5 11,17.5 11,11 17.5,11 " />
        </svg>
      );
    } else {
      maxOrFullIcon = (
        <svg className="titlebar__fullscreen-svg" x="0px" y="0px" viewBox="0 0 20 20">
          <path d="M5.3,16H13L4,7v7.7C4.6,14.7,5.3,15.4,5.3,16z" />
          <path d="M14.7,4H7l9,9V5.3C15.4,5.3,14.7,4.6,14.7,4z" />
        </svg>
      );
    }

    let minimizeClass = 'titlebar__stoplight__minimize';
    if (this.props.isFullscreen) {
      minimizeClass += ' titlebar__stoplight__minimize--disabled';
    }

    return (
      <div className="titlebar">
        <div className="titlebar__stoplight">
          <div className="titlebar__stoplight__close" onClick={this.handleClose}>
            <svg className="titlebar__close-svg" x="0px" y="0px" viewBox="0 0 20 20">
              <polygon points="15.9,5.2 14.8,4.1 10,8.9 5.2,4.1 4.1,5.2 8.9,10 4.1,14.8 5.2,15.9 10,11.1 14.8,15.9 15.9,14.8 11.1,10 " />
            </svg>
          </div>
          <div className={minimizeClass} onClick={this.handleMinimize}>
            <svg className="titlebar__minimize-svg" x="0px" y="0px" viewBox="0 0 20 20">
              <rect x="2.4" y="9" width="15.1" height="2" />
            </svg>
          </div>
          <div className="titlebar__stoplight__fullscreen" onClick={this.handleMaximizeOrFullscreen}>
            {maxOrFullIcon}
          </div>
        </div>
      </div>
    );
  }

  buildWindows() {
    let maxOrRestoreIcon;
    if (this.props.isMaximized) {
      maxOrRestoreIcon = (
        <svg className="titlebar__maximize-svg" x="0px" y="0px" viewBox="0 0 10.2 10.1">
          <path d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z" />
        </svg>
      );
    } else {
      maxOrRestoreIcon = (
        <svg className="titlebar__fullscreen-svg" x="0px" y="0px" viewBox="0 0 10.2 10.1">
          <path d="M0,0v10.1h10.2V0H0z M9.2,9.2H1.1V1h8.1V9.2z" />
        </svg>
      );
    }

    return (
      <div className="titlebar">
        <div className="titlebar__windows">
          <div className="titlebar__windows__minimize" onClick={this.handleMinimize}>
            <svg className="titlebar__minimize-svg" x="0px" y="0px" viewBox="0 0 10.2 1">
              <rect width="10.2" height="1"/>
            </svg>
          </div>
          <div className="titlebar__windows__fullscreen" onClick={this.handleMaximizeOrFullscreen}>
            {maxOrRestoreIcon}
          </div>
          <div className="titlebar__windows__close" onClick={this.handleClose}>
            <svg className="titlebar__close-svg" x="0px" y="0px" viewBox="0 0 10.2 10.2">
              <polygon points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return this.props.platform === 'win32' ? this.buildWindows() : this.buildStoplight();
  }
}
