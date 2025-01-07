'use client';

import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { TableCell, TableRow } from './ui/table';

export default function SortableRow({
	id,
	index,
	children
}: {
	id: string;
	index: number;
	children: React.ReactNode;
}) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition
	};

	return (
		<TableRow ref={setNodeRef} style={style} className='group'>
			<TableCell
				className='relative cursor-grab active:cursor-grabbing'
				{...attributes}
				{...listeners}
			>
				{index + 1}
			</TableCell>
			{children}
		</TableRow>
	);
}
