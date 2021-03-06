import passport from 'passport';
import routes from '../routes';
import User from '../models/User';

export const getJoin = (req, res) => {
    res.render('join', {
        pageTitle: 'Join',
    });
};
export const postJoin = async(req, res, next) => {
    const {
        body: {
            name,
            email,
            password,
            passwordCheck
        },
    } = req;
    const usedEmail = await User.findOne({
        email
    });
    if (password !== passwordCheck) {
        req.flash("error", "Passwords don't match");
        res.status(400);
        res.render('join', {
            pageTitle: 'Join',
        });
    } else if (usedEmail) {
        req.flash("error", "ID already exists");
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
    successFlash: "Welcome youtube",
    failureFlash: "Can't log in. Check email and/or password"
});

//1. 깃허브에 로그인 하기 위한 컨트롤러
export const githubLogin = passport.authenticate("github", {
    successFlash: "Welcome youtube",
    failureFlash: "Can't log in at this time"
});

//4. 콜백 함수로 git정보가 잘 돌아오고 passport git으로 로그인이 완료된다면 실행
export const githubLoginCallback = async(_, __, profile, cb) => {
    const {
        _json: {
            id,
            avatar_url: avatarUrl,
            name,
            email
        }
    } = profile;
    try {
        const user = await User.findOne({
            email
        });
        if (user) {
            user.githubId = id;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

//5. 모든 로그인 활동이 완료되면 home으로 돌려보내기
export const postGithubLogIn = (req, res) => {
    res.redirect(routes.home);
};

export const logout = (req, res) => {
    req.flash("info", "Logged out, see you later");
    req.logout();
    res.redirect(routes.home);
};

export const getMe = async(req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("videos");
        res.render("userDetail", { pageTitle: "User Detail", user });
    } catch (error) {
        res.redirect(routes.home);
    }
};

export const userDetail = async(req, res) => {
    const {
        params: {
            id
        }
    } = req;
    try {
        const user = await User.findById(id).populate("videos");
        res.render("userDetail", {
            pageTitle: "User Detail",
            user
        });
        console.log(user);
    } catch (error) {
        req.flash("error", "User not found");
        res.redirect(routes.home);
    }
}
export const getEditProfile = (req, res) => {
    res.render('editProfile', {
        pageTitle: 'Edit Profile',
    });
}

export const postEditProfile = async(req, res) => {
    const {
        body: {
            name,
            email
        },
        file
    } = req;

    try {
        await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            avatarUrl: file ? file.location : req.user.avatarUrl
        });
        req.flash("success", "Profile Update");
        res.redirect(routes.me);
    } catch (error) {
        req.flash("error", "Can't update profile");
        res.redirect(routes.editProfile)
    }
};
export const getChangePassword = (req, res) =>
    res.render('changePassword', {
        pageTitle: 'Change Password',
    });

export const postChangePassword = async(req, res) => {
    const {
        body: {
            oldPassword,
            newPassword,
            newPassword1
        }
    } = req;

    try {
        if (newPassword !== newPassword1) {
            req.flash("error", "Password don't mathc");
            res.status(400);
            res.redirect(`/users/${routes.changePassword}`);
            return;
        }
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me)
    } catch (error) {
        req.flash("error", "Can't change password");
        res.status(400);
        res.redirect(`/users/${routes.changePassword}`);
    }
}