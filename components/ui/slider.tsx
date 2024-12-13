'use client';

import * as React from 'react';
import { Slider as SliderPrimitive } from '@ark-ui/react/slider';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef<
	React.ElementRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, onPointerDown, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn(
			'relative flex h-min w-full touch-none select-none items-center',
			className
		)}
		{...props}
		thumbAlignment='center'
	>
		<SliderPrimitive.Control
			className='group relative flex h-3 w-full grow cursor-pointer items-center'
			onPointerDown={onPointerDown}
		>
			<SliderPrimitive.Track
				className='h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20'
				style={{ position: 'absolute' }}
			>
				<SliderPrimitive.Range className='h-full rounded-full bg-primary' />
			</SliderPrimitive.Track>
			<SliderPrimitive.Thumb
				index={0}
				className='pointer-events-none block size-3 rounded-full bg-primary opacity-0 outline-none transition-opacity duration-75 group-hover:opacity-100'
			>
				<SliderPrimitive.HiddenInput />
			</SliderPrimitive.Thumb>
		</SliderPrimitive.Control>
	</SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
