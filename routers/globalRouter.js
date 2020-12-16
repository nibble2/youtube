import express from "express";
import passport from "passport";
import routes from "../routes";
import {
    home,
    search
} from "../controllers/videoController";
import {
    getLogin,
    getJoin,
    postLogin,
    postJoin,
    logout,
    githubLogin,
    postGithubLogIn
} from "../controllers/userController";
import {
    onlyPublic,
    onlyPrivate
} from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.logout, onlyPrivate, logout);
globalRouter.get(routes.search, search);

//1. 깃허브 페이지로 이동
globalRouter.get(routes.gitHub, githubLogin);

globalRouter.get(
    routes.githubCallback,
    //3. callbakURL로 접근했다면 passport.authenticate()를 이용하여 로그인
    passport.authenticate("github", {
        failureRedirect: "/login"
    }),
    //5. 모든 로그인 활동이 완료되면 home으로 돌려보내기
    postGithubLogIn
);
export default globalRouter;