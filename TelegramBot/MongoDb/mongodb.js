const mongoose = require('mongoose')

module.exports = {
    mongoDb() {
        mongoose.connect("mongodb+srv://skayvoker:Bodich11041996p@cluster0.izya5.mongodb.net/?retryWrites=true&w=majority")
            .then((res) => {
                console.log('Db connected')
            }).catch((err) => {
                console.log(err)
            })
    }

}