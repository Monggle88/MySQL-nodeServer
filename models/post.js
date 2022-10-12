'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Post.init(
        {
            postId: {
                allowNull: false, // NOT NULL, Null을 허용하지 않음
                autoIncrement: true, // AUTO_INCREMENT
                primaryKey: true, // PRIMARY KEY, 기본키
                unique: true, // UNIQUE, 유일한 값만 존재할 수 있음
                type: DataTypes.INTEGER,
            },
            userId: DataTypes.INTEGER,
            nickname: DataTypes.STRING,
            title: DataTypes.STRING,
            content: DataTypes.STRING,
            createdAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            likes: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Post',
        },
    );
    return Post;
};
