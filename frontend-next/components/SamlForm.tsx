import React from 'react';
import data from '../common/utils/_data';
import {ErrorMessage} from './Messages';
import {Project} from "../common/project";
import {InputGroup} from "reactstrap";
import {Utils} from "../common/utils";
import Button from "components/base/forms/Button";

export const SamlForm = class extends React.Component {
    static displayName = 'SamlForm'

    constructor(props) {
        super(props);
        this.state = {};
    }

    submit = (e) => {
        if (this.state.isLoading || !this.state.saml) {
            return
        }
        this.setState({ error: false, isLoading: true });

        data.post(`${Project.api}auth/saml/${this.state.saml}/request/`)
            .then((res) => {
                if (res.headers && res.headers.Location) {
                    document.location.href = res.headers.Location
                } else {
                    this.setState({error:true})
                }
            })
            .catch(() => {
                this.setState({ error: true, isLoading: false });
            });
    }

    render() {
        return (
            <form onSubmit={this.submit} className="saml-form" id="pricing">
        <InputGroup
            inputProps={{ className: 'full-width' }}
        onChange={e => this.setState({ saml: Utils.safeParseEventValue(e) })}
        value={this.state.saml}
        type="text" title="Organisation Name"
            />
            {
                this.state.error && <ErrorMessage error="Please check your organisation name and try again."/>
            }
            <div className="text-right">
        <Button disabled={this.state.isLoading} type="submit" disabled={!this.state.saml}>
        Continue
        </Button>
        </div>

        </form>
    );
    }
};


