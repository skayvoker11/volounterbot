const mongoose = require('mongoose')

module.exports = {
    mongoDb() {
        mongoose.connect("mongodb+srv://skayvoker:Bodich1234567890p@cluster0.izya5.mongodb.net/?retryWrites=true&w=majorit")
            .then((res) => {
                console.log('Db connected')
            }).catch((err) => {
                console.log(err)
            })
    }

}