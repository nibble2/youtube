import routes from '../routes';
import Video from '../models/Video';

export const home = async (req, res) => {
	try {
		const videos = await Video.find({}).sort({
			_id: -1,
		}); // DB에 있는 모든 Video 가져옴
		res.render('home', {
			pageTitle: 'Home',
			videos,
		});
	} catch (error) {
		// console.log(error);
		res.render('home', {
			pageTitle: 'Home',
			videos: [],
		});
	}
};

export const search = async (req, res) => {
	const {
		query: {
			term: searchingBy
		},
	} = req;
	let videos = [];
	try {
		videos = await Video.find({
			title: {
				$regex: searchingBy,
				$options: 'i'
			},
		});
	} catch (error) {
		console.log(error);
	}
	res.render('search', {
		pageTitle: 'Search',
		searchingBy,
		videos,
	});
};

export const getUpload = (req, res) =>
	res.render('upload', {
		pageTitle: 'Upload',
	});


export const postUpload = async (req, res) => {
	const {
		body: {
			title,
			description
		},
		file: {
			path
		}
	} = req;
	const newVideo = await Video.create({
		fileUrl: path,
		title,
		description,
		creator: req.user.id
	});
	//User model, Video Model connect
	req.user.videos.push(newVideo.id);
	req.user.save();
	res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
	const {
		params: {
			id
		}
	} = req;
	try {
		const video = await Video.findById(id).populate("creator");
		res.render("videoDetail", {
			pageTitle: video.title,
			video
		});
	} catch (error) {
		res.redirect(routes.home);
	}
};

export const getEditVideo = async (req, res) => {
	const {
		params: {
			id
		},
	} = req;
	try {
		const video = await Video.findById(id);
		// console.log(req.user.id)
		if (video.creator !== req.user.id) {
			throw Error();
		} else {
			res.render('editVideo', {
				pageTitle: 'editVideo',
				video,
			});
		}
	} catch (error) {
		res.redirect(routes.home);
	}
};

export const postEditVideo = async (req, res) => {
	const {
		params: {
			id
		},
		body: {
			title,
			description
		},
	} = req;

	try {
		await Video.findByIdAndUpdate({
			_id: id,
		}, {
			title,
			description,
		}, );
		res.redirect(routes.videoDetail(video.id));
	} catch (error) {
		res.redirect(routes.home);
	}
};

export const deleteVideo = async (req, res) => {
	const {
		params: {
			id
		},
	} = req;
	try {
		const video = await Video.findById(id);
		if (video.creator !== req.user.id) {
			throw Error();
		} else {
			await Video.findByIdAndRemove({
				_id: id,
			});
		}
	} catch (error) {
		console.log(error);
	}
	res.redirect(routes.home);
};

// Register Video View

export const postRegisterView = async (req, res) => {
	const {
		params: {
			id
		}
	} = req;
	try {
		const video = await Video.findById(id);
		video.views += 1;
		video.save();
		res.status(200);
	} catch (error) {
		res.status(400);
	} finally {
		res.end();
	}
}