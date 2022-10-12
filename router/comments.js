const express = require('express');
const { Comment } = require('../models');
const { Post } = require('../models');
const auth = require('../middleware/auth');
const { runInContext } = require('lodash');
const router = express.Router();

// 댓글 생성
router.post('/comments/:postId', auth, async (req, res, next) => {
    // 토큰 정보 받아오기
    const { user } = res.locals;

    const postId = req.params.postId;
    const post = await Post.findOne({ where: { postId } });
    if (!post) {
        return res.status(400).send({ message: 'post를 찾을 수 없습니다.' });
    }

    const { comment } = req.body;
    if (!comment) {
        return res.status(400).send({ errorMessage: '내용이 비었습니다.' });
    }

    await Comment.create({
        postId,
        userId: user.userId,
        nickname: user.nickname,
        comment,
    });

    res.send({ message: '댓글 작성에 성공하였습니다.' });
});

// 댓글 목록 조회
router.get('/comments/:postId', async (req, res, next) => {
    const postId = req.params.postId;
    const post = await Post.findOne({ where: { postId } });
    if (!post) {
        return res.status(400).send({ message: 'post를 찾을 수 없습니다.' });
    }

    const comments = await Comment.findAll({
        where: { postId },
        order: [['createdAt', 'desc']],
        attributes: {
            exclude: ['postId'],
        },
    });

    return res.status(200).json({ data: comments });
});

// 댓글 수정
router.put('/comments/:commentId', auth, async (req, res, next) => {
    const { user } = res.locals;
    const commentId = req.params.commentId;
    const { comment } = req.body;
    if (!comment) {
        return res.status(400).send({ message: 'comment가 비었습니다.' });
    }

    const targetComment = await Comment.findOne({ where: { commentId } });
    if (!targetComment) {
        return res.status(400).send({ message: 'comment를 찾을 수 없습니다.' });
    }

    if (targetComment.userId !== user.userId) {
        return res.status(400).send({ message: '권한이 없습니다.' });
    }

    await targetComment.update({ comment }, { where: { commentId } });

    res.status(201).send({ message: '댓글 수정이 완료되었습니다.' });
});

// 댓글 삭제
router.delete('/comments/:commentId', auth, async (req, res, next) => {
    const { user } = res.locals;

    const commentId = req.params.commentId;

    const comment = await Comment.findOne({ where: { commentId } });

    if (comment.userId !== user.userId) {
        return res.status(400).send({ message: '권한이 없습니다.' });
    }

    await Comment.destroy({ where: { commentId } });

    return res
        .status(200)
        .send({ message: 'Comment가 성공적으로 삭제되었습니다.' });
});

module.exports = router;
