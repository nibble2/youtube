import multer from 'multer';
import routes from './routes';

const multerVideo = multer({
	dest: 'uploads/videos/',
});

export const localsMiddleware = (req, res, next) => {
	res.locals.siteName = 'Youtube';
	res.locals.routes = routes;
	res.locals.user = req.user || null;
	console.log(req.user);
	next();
};

//로그인 안한상태
export const onlyPublic = (req, res, next) => {
	if (req.user) {
		res.redirect(routes.home);
	} else {
		next();
	}
}

export const onlyPrivate = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.redirect(routes.home);
	}
}

export const uploadVideo = multerVideo.single('videoFile');