const express = require('express');
const { Post } = require('../models');
const auth = require('../middleware/auth');
const router = express.Router();

// 작성
router.post('/posts', auth, async (req, res, next) => {
    // 토큰 정보 받아오기
    const { user } = res.locals;

    const { title, content } = req.body;

    if (!title || !content) {
        return res
            .status(400)
            .send({ errorMessage: '제목 혹은 내용이 비었습니다.' });
    }

    await Post.create({
        userId: user.userId,
        nickname: user.nickname,
        title,
        content,
        likes: 0,
    });

    res.send({ message: '게시글 작성에 성공하였습니다.' });
});

// 조회
router.get('/posts', async (req, res, next) => {
    const post = await Post.findAll({
        attributes: {
            exclude: ['content'],
        },
    });

    res.status(200).json({ data: post });
});

// 상세조회
router.get('/posts/:postId', async (req, res, next) => {
    const postId = req.params.postId;

    const post = await Post.findOne({ where: { postId } });
    if (!post) {
        return res.status(400).send({ message: 'post를 찾을 수 없습니다.' });
    }

    res.status(200).json({ data: post });
});

// 수정
router.put('/posts/:postId', auth, async (req, res, next) => {
    const postId = req.params.postId;
    const { title, content } = req.body;
    if (!title || !content) {
        return res
            .status(400)
            .send({ message: 'title 혹은 content가 비었습니다.' });
    }
    const { user } = res.locals;

    const post = await Post.findOne({ where: { postId } });

    if (post.userId !== user.userId) {
        return res.status(400).send({ message: '권한이 없습니다.' });
    }

    await Post.update({ title, content }, { where: { postId } });

    res.status(201).send({ message: '게시글 수정이 완료되었습니다.' });
});

// 삭제
router.delete('/posts/:postId', auth, async (req, res, next) => {
    const postId = req.params.postId;
    const { user } = res.locals;

    const post = await Post.findOne({ where: { postId } });

    if (post.userId !== user.userId) {
        return res.status(400).send({ message: '권한이 없습니다.' });
    }

    await Post.destroy({ where: { postId } });

    return res
        .status(200)
        .send({ message: '게시글이 성공적으로 삭제되었습니다.' });
});

module.exports = router;
