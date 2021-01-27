import React from 'react';
import { FontAwesomeIcon, FontAwesomeIconProps } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/fontawesome-svg-core';

function Icon({ prefix = 'fal', icon, ...rest }: Props) {

	if (icon) {
		return <FontAwesomeIcon icon={[prefix, icon]} {...rest} />
	}

	return null;
}


interface Props extends FontAwesomeIconProps {
	prefix?: 'fas' | 'far' | 'fal' | 'fab'
	icon: IconName
}

export default Icon;