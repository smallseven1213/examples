import React from 'react'
import { fromJS } from 'immutable'
import {
	Steps,
	Step
} from './index'

/**
 Step DEMO
 */
export default function StepDemo() {
	return (
		<Steps name="demo">
			{({step, gotoNextStep, gotoPrevStep, gotoSpecStep}) => (
				<div>
					<p>{step}</p>
					<Step>
						{({data}) => (
							<div><p>111</p></div>
						)}
					</Step>
					<Step>
						{({data}) => (
							<div>{data ? data.get('data') : null}</div>
						)}
					</Step>
					<Step>
						{({data}) => (
							<div>333</div>
						)}
					</Step>
					<button disabled={step === 1} onClick={() => gotoPrevStep()}>prev</button>
					<button
						disabled={step === 3}
						onClick={() => gotoNextStep(fromJS({
							data: 'hello'
						}))}
					>next</button>
					<button
						disabled={step === 3}
						onClick={() => gotoSpecStep({
							stepNum: 3,
							data: fromJS({
								data: 'hello'
							})
						})}
					>到3</button>
				</div>
			)}
		</Steps>
	)
}
