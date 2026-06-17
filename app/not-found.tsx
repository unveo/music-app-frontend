import Header from '@/components/Header';
import NotFoundComponent from '@/components/NotFound';
import Player from '@/components/Player';

export default function NotFound() {
	return (
		<>
			<Header></Header>
			<main>
				<div className='div-main'>
					<NotFoundComponent></NotFoundComponent>
				</div>
			</main>
			<Player></Player>
		</>
	);
}
