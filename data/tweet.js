import SQ from 'sequelize'
import { sequelize } from '../db/database.js';
import { User } from './auth.js';

const DataTypes = SQ.DataTypes

// tweets 테이블 만들기
export const Tweet = sequelize.define(
    'tweet',
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true
        }, 
        text:{
            type:DataTypes.TEXT,
            allowNull:false
        }
    },
);
Tweet.belongsTo(User);  // belongsTo(): join의 개념. Tweet과 User의 join.

const INCLUDE_USER = { // join했을 때 보고싶은것만 뽑아오는 목록을 새롭게 정의.
    attributes: [
        'id',
        'text',
        'createdAt',
        'userId',
        [sequelize.col('user.name'), 'name'],
        [sequelize.col('user.username'), 'username'],
        [sequelize.col('user.url'), 'url'],
    ],
    include: {         // include 옵션: User과 belongsTo() 된 내용을 Join해서 보여줌.
        model: User,
        attributes: [],
    }
}

const ORDER_DESC = {      // 시간을 기준으로 내림차순으로 가져오고 싶은 경우.
    order: [['createdAt', 'DESC']]
}

// 1)
export async function getAll() { // 0508 // userId의 1번이 누가썼는지를 알아야함!
    return Tweet.findAll({...INCLUDE_USER, ...ORDER_DESC}
)
}

// 2)
export async function getAllByUsername(username) {
    return Tweet.findAll({
        ...INCLUDE_USER,
        ...ORDER_DESC,
    include: {
        ...INCLUDE_USER.include,
        where: {username}
    }
})};


// 3)
export async function getById(id) {
    return Tweet.findOne({
        where: {id},
        ...INCLUDE_USER
    });
}



 // 4)
export async function create(text, userId) {
    return Tweet.create({text,userId}).then((data)=>{
        console.log(data);
        return data;
    });
} // 0510


// 5)
export async function update(id, text) {
    return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {tweet.text=text;
    return tweet.save();
});
}




// 6)
export async function remove(id) {
    return Tweet.findByPk(id, INCLUDE_USER).then((tweet) => {
        tweet.destroy();
    });
}