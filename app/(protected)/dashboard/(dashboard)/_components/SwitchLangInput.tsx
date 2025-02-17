import * as React from "react";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

const SwitchLangInput = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<div className="switch-lang">
				<input {...props} id="language-toggle" className="check-toggle check-toggle-round-flat" type="checkbox"/>
				<label htmlFor="language-toggle"></label>
				<span className="on">VI</span>
				<span className="off">EN</span>
			</div>
		)
	}
)
SwitchLangInput.displayName = "SwitchLangInput"

export { SwitchLangInput }
