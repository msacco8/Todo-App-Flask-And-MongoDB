// the feature of defining models is very powerful and the robustness
// of MongoDB's implementation seems to lend itself to more
// potential functionality than would be present in something using
// Flask / Sqlite. I like the document model and as someone who hasn't
// been exposed to NoSQL before, it actually was quite intuitive to me.
const mongoose = require('mongoose');
const todoTaskSchema = new mongoose.Schema({
content: {
type: String,
required: true
},
date: {
type: Date,
default: Date.now
}
})
module.exports = mongoose.model('TodoTask',todoTaskSchema);