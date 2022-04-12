import { MongoClient, ObjectId } from "mongodb";
import express from 'express';

const app = express();

app.set('view engine', 'ejs');

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


const server = app.listen(process.env.PORT || 8000, () => {
  console.log('now listening to port 8000');
})

// TudxyMsEJlEwoUZn
const connectionString = 'mongodb+srv://omk13:TudxyMsEJlEwoUZn@cluster0.13zfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const getAllTasks = (collection, res) => {
  return collection.find().toArray().then((tasks) => {
    res.render('index.ejs', {tasks: tasks});
  });
}
MongoClient.connect(connectionString)
.then(client => {
  console.log('connected to db');
  const db = client.db('todoDb');
  const taskCollection = db.collection('tasks');
    app.get('/', async (req, res) => {
      return getAllTasks(taskCollection, res);
    })
    app.get('/task', async (req, res) => {
      return getAllTasks(taskCollection, res);
    })
    app.post('/task', async (req, res) => {
      req.body['isComplete'] = false;
      taskCollection.insertOne(req.body).then(() => getAllTasks(taskCollection, res));
    })
    app.delete('/task/:id', async (req, res) => {
      const id = new ObjectId(req.params.id);
      return taskCollection.deleteOne({_id: id})
        .then((result) => {
          if (result.deletedCount == 0) {
            res.send('task not found')
          } else {
            return getAllTasks(taskCollection, res);
          }
        });
    })
    app.put('/task/toggle/:id', async (req, res) => {
      const id = new ObjectId(req.params.id);
      return taskCollection.find({_id: id}).toArray().then((tasks) => {
        if (tasks.length > 0) {
          const task = tasks[0];
          return taskCollection.updateOne({_id: id}, {'$set':{isComplete: !task['isComplete']}})
            .then((result) => {
              return getAllTasks(taskCollection, res);
            })
        }
      })
    })
  })
