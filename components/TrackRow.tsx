import {
	TrackForAlbumDto,
	TrackForAlbumSchema
} from '@/services/album/album.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormItem, FormLabel, FormMessage } from './ui/form';

export default function TrackRow({ index }: { index }) {
	const trackForAlbumForm = useForm<TrackForAlbumDto>({
		resolver: zodResolver(TrackForAlbumSchema),
		defaultValues: {
			title: '',
			changeableId: '',
			audio: undefined
		}
	});

	return (
		<li>
			<Form {...trackForAlbumForm}>
				<form>
					<div className='flex items-center justify-between p-2'>
						<div className='flex items-center gap-8'>
							<div className='w-2'>
								<FormLabel
									htmlFor={`tracks.${index}.position`}
									className='hidden'
								>
									Track Position
								</FormLabel>
								<div id={`tracks.${index}.position`}>{index + 1}</div>
							</div>
							<FormItem>
								<div>
									<FormLabel
										htmlFor={`tracks.${index}.title`}
										className='hidden'
									>
										Track Title
									</FormLabel>
									<FormControl>
										<div className='flex h-10 w-44 items-center rounded-md border border-border px-2'>
											<Input
												id={`tracks.${index}.title`}
												placeholder='Title'
												required
												value={track.title}
												onChange={(e) => {
													let newTracks = [...tracks];
													newTracks[index].title = e.target.value;
													setTracks(newTracks);
												}}
											/>
										</div>
									</FormControl>
								</div>
								<FormMessage />
							</FormItem>
							<FormItem>
								<div>
									<FormLabel
										htmlFor={`tracks.${index}.changeableId`}
										className='hidden'
									>
										Track ID
									</FormLabel>
									<FormControl>
										<div className='flex h-10 w-44 items-center rounded-md border border-border px-2'>
											<Input
												id={`tracks.${index}.changeableId`}
												placeholder='Id'
												required
												value={track.changeableId}
												onChange={(e) => {
													let newTracks = [...tracks];
													newTracks[index].changeableId = e.target.value;
													setTracks(newTracks);
												}}
											/>
										</div>
									</FormControl>
								</div>
								<FormMessage />
							</FormItem>
							<FormItem>
								<div className='h-10'>
									{track.audio ? (
										<FormLabel
											htmlFor={`tracks.${index}.audio`}
											className='flex h-full w-44 max-w-44 cursor-pointer items-center justify-center rounded-md border px-8'
										>
											{track.audio.name}
										</FormLabel>
									) : (
										<FormLabel
											htmlFor={`tracks.${index}.audio`}
											className='flex h-full w-44 cursor-pointer items-center justify-center rounded-md border px-8'
										>
											Upload audio
										</FormLabel>
									)}
									<FormControl>
										<Input
											type='file'
											id={`tracks.${index}.audio`}
											className='hidden'
											accept={`.mp3, .aac, .m4a, .flac, .wav, .aiff, .webm, ${ACCEPTED_AUDIO_TYPES.join(', ')}`}
											onChange={(e) => {
												if (e.target.files?.[0]) {
													const file = e.target.files[0];
													try {
														validateAudio(file);
													} catch (err: any) {
														toast({
															title: err.message,
															variant: 'destructive'
														});
														return;
													}
													// setAudio(file);
													let newTracks = [...tracks];
													newTracks[index].audio = file;
													setTracks(newTracks);
												}
												// tracksField.append({
												// 	title: '',
												// 	changeableId: '',
												// 	audio: undefined
												// });
												// tracksField.remove(index + 1);
											}}
										/>
									</FormControl>
								</div>
								<FormMessage />
							</FormItem>
						</div>
						<Button
							type='button'
							variant='destructive'
							onClick={() => {
								let newTracks = [...tracks];
								newTracks.splice(index, 1);
								setTracks(newTracks);
							}}
						>
							Remove
						</Button>
					</div>
				</form>
			</Form>
		</li>
	);
}
