const express = require('express');

const app = express();
const router = express.Router();

const usersRouter = require('./router/users');
const postsRouter = require('./router/posts');
const commentsRouter = require('./router/comments');
const likesRouter = require('./router/likes');

app.use(express.urlencoded({ extended: false }), router);
app.use(express.json());

app.use([usersRouter]);
app.use([postsRouter]);
app.use([commentsRouter]);
app.use('/like', likesRouter);

// 예외 처리
app.use((req, res, next) => {
    res.status(404).json({ message: '404 Not Found.' });
});

app.listen(8080, () => {
    console.log('서버가 요청을 받을 준비가 됐어요');
});
