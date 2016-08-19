import React from 'react';
import Markdown from 'markdown-it';

export default class FieldMarkdown extends React.Component {
    render() {
        const md = new Markdown;
        return (
            <div className="field field-text">
                <div className="field-name">{this.props.name}</div>
                <div className="field-text-value" dangerouslySetInnerHTML={{__html: md.render(this.props.value)}}></div>
            </div>
        );
    }
}
