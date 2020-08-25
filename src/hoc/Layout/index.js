import React, { Component } from 'react';
import Toolbar from '../../component/Toolbar/Toolbar';
import NavigationItems from '../../component/Toolbar/NavigationItems'

class Layout extends Component {

    render () {
        return (
            <div className="Content">
                <Toolbar bg="#1A5264"><NavigationItems /></Toolbar>
                <main>
                    {this.props.children}
                </main>
            </div>
        )
    }
}

export default Layout;