from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# /// = relative path, //// = absolute path
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///db.sqlite'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.app_context().push()

# instantiate basic sqlite data model
# the ease of use between sqlite and flask seems to be something that differentiates the framework
class Todo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100))
    complete = db.Column(db.Boolean)

# All routes provide an easy way to maintain reusability in code
# and allow for quick and modular integration. This is a defining
# feature of Flask which may be present in Svelte to some regard
# Add new todo route
@app.route("/add", methods=["POST"])
def add():
    title = request.form.get("title")
    new_todo = Todo(title=title, complete=False)
    db.session.add(new_todo)
    db.session.commit()
    return redirect(url_for("home"))

# Update existing todo route
@app.route("/update/<int:todo_id>")
def update(todo_id):
    todo = Todo.query.filter_by(id=todo_id).first()
    todo.complete = not todo.complete
    db.session.commit()
    # concept of returning redirects seems unique to Flask and is very useful
    return redirect(url_for("home"))

# Delete existing todo route
@app.route("/delete/<int:todo_id>")
def delete(todo_id):
    todo = Todo.query.filter_by(id=todo_id).first()
    db.session.delete(todo)
    db.session.commit()
    # allows for much greater control over the flow of the UI
    return redirect(url_for("home"))
    
# home route
@app.route("/")
def home():
    # very lightweight method of reading from database, stands out against MongoDB
    todo_list = Todo.query.all()
    return render_template("base.html", todo_list=todo_list)

if __name__ == "__main__":
    db.create_all()
    app.run(debug=True)