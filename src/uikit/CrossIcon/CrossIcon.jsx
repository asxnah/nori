import PropTypes from 'prop-types';
import './CrossIcon.css';

export const CrossIcon = ({ width = 20, height = 20 }) => (
	<svg
		className="crossIcon"
		width={width}
		height={height}
		viewBox="0 0 20 20"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<g clipPath="url(#clip0_438_171)">
			<path d="M2 2L17.8877 17.8877" strokeWidth="3" strokeLinecap="round" />
			<path
				d="M17.8877 2.11234L2.00003 18"
				strokeWidth="3"
				strokeLinecap="round"
			/>
		</g>
		<defs>
			<clipPath id="clip0_438_171">
				<rect width="20" height="20" fill="white" />
			</clipPath>
		</defs>
	</svg>
);

CrossIcon.propTypes = {
	width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
