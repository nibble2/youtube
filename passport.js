import passport from 'passport';
import GithubStrategy from 'passport-github';
import User from './models/User';
import { githubLoginCallback } from './controllers/userController';
//아이디 찾아서 존재하면 반환
passport.use(User.createStrategy());

passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GH_ID,
			clientSecret: process.GH_SECRET,
			callbackURL: 'http://localhost:4000/auth/github/callback',
		},
		githubLoginCallback,
	),
);

//쿠키에는 오직 user.id만 담아서 보내도록 해
passport.serializeUser(User.serializeUser());

// user.id로 사용자 찾기
passport.deserializeUser(User.deserializeUser());
