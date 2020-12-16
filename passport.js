import passport from 'passport';
import GithubStrategy from 'passport-github';
import User from './models/User';
import {
    githubLoginCallback
} from './controllers/userController';
import routes from './routes';

//아이디 찾아서 존재하면 반환
passport.use(User.createStrategy());

//2. 로그인 전략 실행 - 안에 정보를 이용하여 github로 이동
passport.use(
    new GithubStrategy({
            clientID: process.env.GH_ID,
            clientSecret: process.env.GH_SECRET,
            //3. 로그인 하고 돌아 온 후 callblackURL로 접근
            callbackURL: `http://localhost:4000${routes.githubCallback}`,
        },
        //4. 라우터와 컨트롤러에서 로그인이 성공적으로 이뤄졌으면 실행한다.
        githubLoginCallback,
    ),
);

//쿠키에는 오직 user.id만 담아서 보내도록 해
passport.serializeUser(User.serializeUser());

// user.id로 사용자 찾기
passport.deserializeUser(User.deserializeUser());