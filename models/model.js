class BaseModel {
    constructor(mongoose, name, model) {
        this.model = mongoose.model(name, model);
    }

    findById(id) {
        return this.model.findById(id).exec();
    }

    find(filter = {}) {
        return this.model.find(filter).exec();
    }

    findOne(filter = {}) {
        return this.model.findOne(filter).exec();
    }

    delete(filter) {
        return this.model.deleteOne(filter).exec();
    }

    deleteById(id) {
        return this.model.deleteOne({
            _id: id
        }).exec();
    }

    create(data) {
        const model = new this.model(data);
        return model.save();
    }

    aggregate(aggregation = []) {
        return this.model.aggregate(aggregation);
    }
}

module.exports = BaseModel;