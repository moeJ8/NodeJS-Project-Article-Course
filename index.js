const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/Article");
const app = express();

const port = 3000;



app.use(express.json());
//mongodb+srv://<db_username>:<db_password>@mynodejscluster.q2vx9.mongodb.net/?retryWrites=true&w=majority&appName=MyNodeJSCluster

mongoose.connect("mongodb+srv://mohammad:mo12345@mynodejscluster.q2vx9.mongodb.net/?retryWrites=true&w=majority&appName=MyNodeJSCluster")
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB", err);
});



app.get("/", (req, res) => {
    res.send("Hello from home");
});

app.get("/hello", (req, res) => {
    res.send("Hello");
});

app.get("/numbers", (req, res)=>{
    let numbers = "";
    for(let i = 0; i<=100; i++){  
        numbers += i+ "  ";
    }
    // res.sendFile(__dirname + "/views/numbers.ejs");
    res.render("numbers.ejs", {
        name: "Moe",
        numbers: numbers
    });
});

app.get("/findSummation/:number1/:number2", (req, res)=>{
    console.log(req.params);
    let num1 = req.params.number1;
    let num2 = req.params.number2;

    const total = Number(num1) + Number(num2);
    res.send(`The numbers are ${num1} and ${num2} and the total is ${total}`);
});


app.get("/sayHello", (req, res)=>{
    // console.log(req.body);
    // const name = req.body.name;
    // console.log(req.query);
    // res.send(`Hello ${name}, Age is ${req.query.age}`);

    res.json({
        name: req.body.name,
        age: req.query.age,
        language: "Arabic"
    });
});
app.put("/test", (req, res)=>{
    res.send("Hello from test");
});

app.post("/addComment", (req, res) => {
    res.send("Post request on add comment");
});

app.delete("/testingDelete", (req, res) => {
    res.send("Delete request ");
});

// ================================ Article Routes ================================
app.post("/articles", async (req, res) => {
    const newArticle = new Article();

    const artTitle = req.body.articleTitle;
    const artBody = req.body.articleBody;
    
    newArticle.title = artTitle;
    newArticle.body = artBody;
    newArticle.numberOfLikes = 0;

    await newArticle.save();
    res.json(newArticle);
});

app.get("/articles", async (req, res) => {
    const articles = await Article.find({});
    res.json(articles);
});
app.get("/articles/:articleId", async (req, res) => {
    const articleId = req.params.articleId;
    try{
        const article = await Article.findById(articleId);
        res.json(article);
        return;
    } catch(err){
        console.log("Error finding article ID", articleId);
        return res.send("error");
    }
}); 

app.delete("/articles/:articleId", async (req, res) => {
    const articleId = req.params.articleId;
    try{
        await Article.findByIdAndDelete(articleId);
        res.send("Article deleted successfully");
        return;
    } catch(err){
        console.log("Error deleting article ID", articleId);
        return res.send(err);
    }
});

app.get("/showArticles", async (req, res) => {
    const articles = await Article.find({});
    res.render("articles.ejs", {
        articles: articles
    });
});

app.listen(port, () => {
    console.log(`I am listning on port ${port} `);
});