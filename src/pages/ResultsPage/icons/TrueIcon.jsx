import PropTypes from 'prop-types';

export const TrueIcon = ({ fill = '#323232' }) => (
	<svg
		width="60"
		height="60"
		viewBox="0 0 52 60"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clipPath="url(#clip0_310_29)">
			<rect
				x="41.6785"
				width="12"
				height="62"
				rx="6"
				transform="rotate(26.5973 41.6785 0)"
				fill={fill}
			></rect>
			<rect
				x="0.697632"
				y="28.9199"
				width="12"
				height="37.2388"
				rx="6"
				transform="rotate(-29.5603 0.697632 28.9199)"
				fill={fill}
			></rect>
		</g>
		<defs>
			<clipPath id="clip0_310_29">
				<rect
					width="60"
					height="60"
					fill="transparent"
					transform="translate(0.697632)"
				></rect>
			</clipPath>
		</defs>
	</svg>
);

TrueIcon.propTypes = {
	fill: PropTypes.string,
};
