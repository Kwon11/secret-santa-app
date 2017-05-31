import React, { Component } from 'react'
import Header from './Header.jsx'
import MainView from './MainView.jsx'

export default class App extends Component {
	render() {
		return (
			<div>
				<Header />
        <MainView />
			</div>
		)
	}
}
