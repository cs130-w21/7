import React, { Component } from 'react';
import Chips, { Chip } from 'react-chips'



class HabitList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: []
        }
    }

    onChange = value => {
        this.setState({ value });
    }

    render() {
        return (
            <>
                <Chips
                    value={this.state.value}
                    onChange={this.onChange}
                    createChipKeys={['a']}
                    placeholder={this.props.placeholder}
                    suggestions={this.props.data}
                    shouldRenderSuggestions={value => value.length >= 0}
                    fromSuggestionsOnly={false}></Chips>
            </>
        );
    }
}

export default HabitList;
