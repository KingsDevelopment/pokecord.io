const BaseModel = require('./model');

class Users extends BaseModel {
    constructor(mongoose) {
        super(mongoose, 'users', { 
            authorId: String,
            roles: Array
        });
    }

    findByAuthorId(authorId) {
        return this.model
        .findOne({
            authorId: authorId
        })
        .exec();
    }
}

module.exports = Users;