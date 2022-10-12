const express = require('express');
const { User } = require('../models');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const router = express.Router();

const usersSchema = Joi.object({
    nickname: Joi.string()
        .alphanum()
        .min(3)
        .required()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    password: Joi.string().min(4).required(),
    confirm: Joi.string().min(4).required(),
});

router.post('/signup', async (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization) {
        res.status(401).send({
            errorMessage: '이미 로그인이 되어있습니다.',
        });
        return;
    }

    try {
        const { nickname, password, confirm } = await usersSchema.validateAsync(
            req.body,
        );
        if (nickname.includes(password) || password.includes(nickname)) {
            return res
                .status(400)
                .send({ errorMessage: 'password 보안레벨 낮음' });
        }

        if (confirm !== password) {
            return res
                .status(400)
                .send({ errorMessage: '비밀번호가 일치하지 않습니다.' });
        }

        const existUsers = await User.findAll({
            where: {
                nickname,
            },
        });

        if (existUsers.length) {
            return res.status(400).send({ errorMessage: '중복된 회원입니다.' });
        }

        await User.create({ nickname, password });

        res.status(201).send({
            message: '회원 가입에 성공하였습니다.',
        });
    } catch (error) {
        return res.status(400).send({ errorMessage: error.message });
    }
});

router.post('/login', async (req, res, next) => {
    const { authorization } = req.headers;

    if (authorization) {
        res.status(401).send({
            errorMessage: '이미 로그인이 되어있습니다.',
        });
        return;
    }

    const { nickname, password } = req.body;

    const user = await User.findOne({
        where: {
            nickname,
            password,
        },
    });

    if (!user) {
        return res
            .status(400)
            .send({ errorMessage: '닉네임 혹은 비밀번호를 확인해주세요.' });
    }

    const token = jwt.sign(
        { userId: user.userId, nickname: user.nickname },
        'MySecretKey',
    );
    res.send({
        token: token,
    });
});

module.exports = router;
