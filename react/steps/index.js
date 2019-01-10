import type { Node } from 'react'
import type { Dispatch } from 'redux'
import type { Map } from 'immutable'
import type { STEP_FIELDS } from '../../reducers/step'
import React, { Fragment, Component } from 'react'
import { connect } from 'react-redux'
import {
	addStepGroup,
	gotoNextStepByStepName,
	gotoPrevStepByStepName,
	gotoSpecStepByStepName,
	removeStepGroup
} from 'actions/step'
import StepComponent from './Step'

// type INITIAL_STEP_TYPE = {
// 	step: number
// }

type Props = {
	children: Node,
	onInitialSteps: Function,
	stepName: string,
	stepData: ?Map<STEP_FIELDS>
}

// const DEFAULT_STATE: INITIAL_STEP_TYPE = {
// 	step: 1
// }

export class StepsComponent extends Component<Props> {
	constructor(props) {
		super(props)
		this.state = {
			_handleGotoNextStep: this._handleGotoNextStep,
			_handleGotoPrevStep: this._handleGotoPrevStep,
			_handleGotoSpecStep: this._handleGotoSpecStep,
			funcChild: null
		}
	}
	static getDerivedStateFromProps(nextProps, prevState) {
		const {
			name
			// onInitialSteps
		} = nextProps
		if (nextProps.step) {
			const funcChild = nextProps.children({
				step: nextProps.step.get('stepNum'),
				gotoNextStep: prevState._handleGotoNextStep,
				gotoPrevStep: prevState._handleGotoPrevStep,
				gotoSpecStep: prevState._handleGotoSpecStep
			})
			const realChild = funcChild.props.children
			let stepIndex = 0
			const nextFuncChild = React.Children.map(realChild, (child, index) => {
				if (child.type.displayName === 'Step'){
					// 將該child與stepName綁定
					stepIndex = stepIndex + 1
					return React.cloneElement(child, {
						stepNum: stepIndex,
						stepName: name
					})
				}
				return child
			})
			return {
				funcChild: nextFuncChild
			}
		}
		return null
	}
	componentDidMount() {
		// initial redux
		const {
			name,
			commonData,
			onInitialSteps
		} = this.props
		onInitialSteps({
			name,
			commonData
		})
	}
	componentWillUnmount() {
		// clear redux
		const {
			name,
			onRemoveSteps
		} = this.props
		onRemoveSteps({
			name
		})
	}
	_handleGotoNextStep = (data) => {
		const {
			name,
			onGotoNextStep
		} = this.props
		onGotoNextStep({
			name,
			data
		})
	}
	_handleGotoPrevStep = (data) => {
		const {
			name,
			onGotoPrevStep
		} = this.props
		onGotoPrevStep({
			name,
			data
		})
	}
	_handleGotoSpecStep = ({stepNum, data}) => {
		const {
			name,
			onSpecPrevStep
		} = this.props
		onSpecPrevStep({
			name,
			stepNum,
			data
		})
	}
	render() {
		const {
			// name,
			// children,
			step
		} = this.props
		if (!step) {
			return (
				<div>initial...</div>
			)
		}
		return (
			<Fragment>
				{this.state.funcChild}
			</Fragment>
		)
	}
}

const mapStateToProps = (state, {name}: Props) => ({
	step: state.getIn(['step', name])
})

const mapDispatchToProps = (dispatch: Dispatch<*>) => ({
	onInitialSteps: ({name, commonData}) => dispatch(addStepGroup({
		name,
		commonData
	})),
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
	})),
	onRemoveSteps: ({name}) => dispatch(removeStepGroup({
		name
	}))
})

export const Steps = connect(mapStateToProps, mapDispatchToProps)(StepsComponent)

export const Step = StepComponent
