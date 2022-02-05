import { Component, JSXElementConstructor } from 'react'
import { Project } from 'common/project'

export default (WrappedComponent: JSXElementConstructor<any>) => {
  class HOC extends Component<{}, { grecaptcher?: any }> {
    static displayName = 'withGrecaptcher'
    state = {
      grecaptcher: undefined,
    }

    renderedGre = false
    interval = 0

    componentDidMount() {
      if (Project.grecaptcher) {
        if (typeof grecaptcha === 'undefined') {
          alert(
            'Grecaptcha not found, add https://www.google.com/recaptcha/api.js to _app.js',
          )
          return
        }
        this.interval = window.setInterval(() => {
          // See https://www.google.com/recaptcha/admin
          // add to _app.js <script type="text/javascript" src='https://www.google.com/recaptcha/api.js'></script>
          if (!this.renderedGre && grecaptcha.render) {
            this.renderedGre = true
            grecaptcha.render(document.getElementById('recaptcha'), {
              sitekey: Project.grecaptcher,
            })
          }

          if (grecaptcha.getResponse) {
            const response = grecaptcha.getResponse()
            if (this.state.grecaptcher !== response) {
              this.setState({ grecaptcher: response })
            }
          }
        }, 100)
      } else {
        alert('grecaptcha key not found in project.js')
      }
    }

    componentWillUnmount() {
      if (this.interval) {
        clearInterval(this.interval)
      }
    }
    render() {
      return (
        <WrappedComponent
          {...this.props}
          grecaptcher={this.state.grecaptcher}
        />
      )
    }
  }

  return HOC
}
