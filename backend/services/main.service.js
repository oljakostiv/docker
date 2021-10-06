module.exports = {
    deleteItem: (db, _id) => db.findByIdAndDelete(_id),

    findItem: (db, item) => db.find(item),

    findOne: (db, item) => db.findOne(item),

    setItem: (db, newItem) => db.create(newItem),

    updateItem: (db, _id, data) => db.findByIdAndUpdate(_id, data, { new: true }),
};
