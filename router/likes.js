const express = require('express');
const { Like, Post } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// 좋아요 목록 조회
/**
 * Like 테이블에서 해당 user의 게시글 목록 반환
 * 1. 로그인 확인
 * 2. 유저이름 추출
 * 3. like 테이블에서 유저이름으로 postId 받기
 * 4. 받은 postId를 가진 post목록을 content 제외하여 목록화
 * 5. 반환
 */
router.get('/', auth, async (req, res, next) => {
    console.log('llll');
    // 로그인 정보확인
    const { user } = res.locals;
    // 유저가 좋아요한 like 목록 추출
    const likesPosts = await Like.findAll({ where: { userId: user.userId } });
    if (likesPosts.length < 1) {
        return res
            .status(400)
            .send({ message: '좋아요 게시글을 찾을 수 없습니다.' });
    }
    // likesPosts의 postId로 targetPosts 추출
    const targetPosts = await Post.findAll({
        where: {
            postId: likesPosts.postId,
            attributes: {
                exclude: ['content'],
            },
        },
    });
    return res.status(200).json({ data: targetPosts });
});

// 좋아요 토글
router.put('/:postId', auth, async (req, res, next) => {
    const { postId } = req.params;
    const truePost = await Post.findAll({ where: { postId } });
    if (truePost.length < 1) {
        return res
            .status(400)
            .send({ message: '해당 포스트를 찾을 수 없습니다.' });
    }

    const { user } = res.locals;
    const likePost = await Like.findOne({
        where: {
            userId: user.userId,
            postId,
        },
    });
    if (likePost) {
        await Like.destroy({ where: { userId: user.userId, postId } });
        await Post.increment({ likes: -1 }, { where: { postId } });
        return res
            .status(201)
            .send({ message: '게시글의 좋아요를 취소하였습니다.' });
    }

    await Like.create({
        postId,
        userId: user.userId,
    });
    await Post.increment({ likes: 1 }, { where: { postId } });
    return res
        .status(201)
        .send({ message: '게시글에 좋아요를 등록하였습니다.' });
});

module.exports = router;
