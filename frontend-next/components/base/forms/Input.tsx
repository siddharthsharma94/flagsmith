/**
 * Created by kylejohnson on 30/07/2016.
 */
import cn from 'classnames';

const Input = class extends React.Component {
  static displayName = 'Input'

  constructor(props, context) {
    super(props, context);
    this.state = { shouldValidate: false, type: this.props.type };
  }

  onFocus = (e) => {
    this.setState({
      isFocused: true,
    });
    this.props.onFocus && this.props.onFocus(e);
  }

  focus = () => {
    if (E2E) return;
    this.input.focus();
  }

  onKeyDown = (e) => {
    if (Utils.keys.isEscape(e)) {
      this.input.blur();
    }
    this.props.onKeyDown && this.props.onKeyDown(e);
  }

  validate = () => {
    this.setState({
      shouldValidate: true,
    });
  }

  onBlur = (e) => {
    this.setState({
      shouldValidate: true,
      isFocused: false,
    });
    this.props.onBlur && this.props.onBlur(e);
  }

  render() {
    const { isValid, onSearchChange, placeholderChar, inputClassName, ...rest } = this.props;

    const className = cn({
      'input-container': true,
      'password': this.props.type === 'password',
      'focused': this.state.isFocused,
      'invalid': this.state.shouldValidate && !isValid,
    }, this.props.className);

    const innerClassName = cn({
      input: true,
    }, inputClassName);

    return (
        <div
            className={className}
        >
              <input
                  ref={c => this.input = c}
                  {...rest} onFocus={this.onFocus}
                  onKeyDown={this.onKeyDown}
                  type={this.state.type}

                  onBlur={this.onBlur}
                  value={this.props.value}
                  className={innerClassName}
              />
          {this.props.type === 'password' && (
              <span onClick={() => this.setState({ type: this.state.type === 'password' ? 'text' : 'password' })} className={`input-icon-right icon ion ${this.state.type === 'text' ? 'ion-ios-eye-off' : 'ion-ios-eye'}`}/>
          )}
        </div>
    );
  }
};


module.exports = Input;
