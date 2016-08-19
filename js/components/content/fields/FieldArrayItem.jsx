import React from 'react';
import FetchService from '../../../services/FetchService';
import __ from 'lodash';
import _ from 'underscore';
import FieldText from '../fields/FieldText.jsx';
import FieldEmpty from '../fields/FieldEmpty.jsx';
import FieldImage from '../fields/FieldImage.jsx';
import FieldMarkdown from '../fields/FieldMarkdown.jsx';

export default class FieldArrayItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { component: null };
    }
    componentDidMount() {
        FetchService.get(`api/component-types/${this.props.item.type}`).then((componentData) => {
            console.log(this.props.item);
            // Add values to fields
            componentData.fields.map((field) => {
                if (__.has(this.props.item, field.slug)) {
                    field.value = __.get(this.props.item, field.slug);
                }
            });
            this.setState(__.assign(this.state, { component: componentData }));
        });
    }
    render() {
        if (this.state.component) {
            return (
                <div className="field-array-item">
                    <div className="field-name">{this.state.component.name}</div>
                    {this.state.component.fields.map((field) => {
                        if (field.type === 'text' || field.type === 'textarea') {
                            if (field.value) {
                                return (<FieldText name={field.name} value={field.value} key={field.slug} />);
                            }
                            return (<FieldEmpty name={field.name} key={field.slug} />);
                        }
                        if (field.type === 'markdown') {
                            if (field.value) {
                                return (<FieldMarkdown name={field.name} value={field.value} key={field.slug} />);
                            }
                            return (<FieldEmpty name={field.name} key={field.slug} />);
                        }
                        if (field.type === 'image' || field.type === 'textarea' || field.type === 'markdown') {
                            if (field.type === 'image') {
                                if (field.value) {
                                    return (<FieldImage name={field.name} url={field.value} key={field.slug} />);
                                }
                                return (<FieldEmpty name={field.name} key={field.slug} />);
                            }
                        }
                    })}
                </div>
            );
        }
        return null;
    }
}
