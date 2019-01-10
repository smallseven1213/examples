import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
	gotoNextStepByStepName,
	gotoPrevStepByStepName,
	gotoSpecStepByStepName
} from 'actions/step'

export class StepComponent extends Component {
	_handleGotoNextStep = (data) => {
		const {
			stepName,
			onGotoNextStep
		} = this.props
		onGotoNextStep({
			name: stepName,
			data
		})
	}
	_handleGotoPrevStep = (data) => {
		const {
			stepName,
			onGotoPrevStep
		} = this.props
		onGotoPrevStep({
			name: stepName,
			data
		})
	}
	_handleGotoSpecStep = ({stepNum, data}) => {
		const {
			stepName,
			onSpecPrevStep
		} = this.props
		onSpecPrevStep({
			name: stepName,
			stepNum,
			data
		})
	}
	render() {
		const {
			display,
			data,
			children
		} = this.props
		if (!display) {
			return null
		}
		return children({
			data,
			gotoNextStep: this._handleGotoNextStep,
			gotoPrevStep: this._handleGotoPrevStep,
			gotoSpecStep: this._handleGotoSpecStep
		})
	}
}

const mapStateToProps = (state, {stepNum, stepName}) => ({
	display: state.getIn(['step', stepName, 'stepNum']) === stepNum,
	data: state.getIn(['step', stepName, 'stepData', String(stepNum)])
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
	onGotoNextStep: ({name, data}) => dispatch(gotoNextStepByStepName({
		name,
		data
	})),
	onGotoPrevStep: ({name, data}) => dispatch(gotoPrevStepByStepName({
		name,
		data
	})),
	onSpecPrevStep: ({name, stepNum, data}) => dispatch(gotoSpecStepByStepName({
		name,
		stepNum,
		data
	}))
})

const Step = connect(mapStateToProps, mapDispatchToProps)(StepComponent)
Step.displayName = 'Step'

export default Step
