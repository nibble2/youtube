import passport from 'passport';
import User from './models/User';

//아이디 찾아서 존재하면 반환
passport.use(User.createStrategy());

//쿠키에는 오직 user.id만 담아서 보내도록 해
passport.serializeUser(User.serializeUser());

// user.id로 사용자 찾기
passport.deserializeUser(User.deserializeUser());
