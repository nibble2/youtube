import routes from '../routes';
import Video from '../models/Video';

export const home = async (req, res) => {
  try {
    const videos = await Video.find({}); // DB에 있는 모든 Video 가져옴
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

export const search = (req, res) => {
  // console.log(videos);
  const {
    query: {
      term: searchingBy
    },
  } = req;
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
    },
  } = req;
  const newVideo = await Video.create({
    fileUrl: path,
    title,
    description,
  });
  res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
  const {
    params: {
      id
    }
  } = req;
  try {
    const video = await Video.findById(id);
    res.render("videoDetail", {
      pageTitle: "video Detail",
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
    }
  } = req;
  try {
    const video = await Video.findById(id);
    res.render("editVideo", {
      pageTitle: "editVideo",
      video
    });
  } catch (error) {
    res.redirect(routes.home);
  }
}

export const postEditVideo = (req, res) => {

}


export const deleteVideo = (req, res) =>
  res.render('deleteVideo', {
    pageTitle: 'Delete Video',
  });