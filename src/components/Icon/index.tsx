import React, { FC, SVGProps, useEffect, useState } from 'react';

function Icon({ name, scale = 'm', ...rest }: Props) {

	const [Icon, setIcon] = useState<FC<SVGProps<SVGSVGElement>>>();
	
	useEffect((): void => {
		import(`!!@svgr/webpack?-svgo,+titleProp,+ref!../../assets/icons/${name}.svg`).then((file) => {
			setIcon(file.default);
		});
	}, [name]);

	let size: number | undefined;

	switch (scale) {
		case 's': size = 20; break;
		case 'm': size = 30; break;
		case 'l': size = 40; break;
		case 'xl': size = 60; break;
		default: size = 30;
	}

	if (Icon) {
		return <Icon height={size} width={size} viewBox='0 0 100 100' preserveAspectRatio='true' {...rest} />
	}

	return null;
}


interface Props extends SVGProps<SVGSVGElement> {
	name: 'settings' | 'climbing' | 'close'
	scale?: 's' | 'm' | 'l' | 'xl'
}

export default Icon;