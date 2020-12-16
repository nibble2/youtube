import passport from 'passport';
import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
	res.render('join', {
		pageTitle: 'Join',
	});
};
export const postJoin = async (req, res, next) => {
	const {
		body: {
			name,
			email,
			password,
			passwordCheck
		},
	} = req;
	if (password !== passwordCheck) {
		res.status(400);
		res.render('join', {
			pageTitle: 'Join',
		});
	} else {
		try {
			const user = await User({
				name,
				email,
			});
			await User.register(user, password);
			next();
		} catch (error) {
			console.log(error);
			res.redirect(routes.home);
		}
	}
};

export const getLogin = (req, res) => {
	res.render('login', {
		pageTitle: 'Login',
	});
};

export const postLogin = passport.authenticate('local', {
	failureRedirect: routes.login,
	successRedirect: routes.home,
});

//1. 깃허브에 로그인 하기 위한 컨트롤러
export const githubLogin = passport.authenticate("github");

//4. 콜백 함수로 git정보가 잘 돌아오고 passport git으로 로그인이 완료된다면 실행
export const githubLoginCallback = (accessToken, refreshToken, profile, cb) => {
	console.log(accessToken, refreshToken, profile, cb);
};

//5. 모든 로그인 활동이 완료되면 home으로 돌려보내기
export const postGithubLogIn = (req, res) => {
	res.send(routes.home);
};

export const logout = (req, res) => {
	req.logout();
	res.redirect(routes.home);
};
export const userDetail = (req, res) =>
	res.render('userDetail', {
		pageTitle: 'User Detail',
	});
export const editProfile = (req, res) =>
	res.render('editProfile', {
		pageTitle: 'Edit Profile',
	});
export const changePassword = (req, res) =>
	res.render('changePassword', {
		pageTitle: 'Change Password',
	});