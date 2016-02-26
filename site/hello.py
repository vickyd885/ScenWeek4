from flask import Flask
from flask import render_template
from flask import request
from algo import run_algo
from flask import jsonify

app = Flask(__name__)

def array(list):
    string = ""
    for x in list:
        string+= x
    print "the string is", string
    return string

@app.route("/")
def hello():
    return render_template('index.html')

def makeList(inputTest):
	for k in inputTest:
		print k

@app.route("/runalgo")
def run():
	#print request.args.get('key')
	data =  request.args.get('key')
	test = eval(data)
	print test
	#makeList(test)
	guards = run_algo(test)
	print guards
	#return guards
	guards = jsonify(list=guards)  
	#print guards
	return guards

	# if(request.method == "POST"):
	# # 	print request.method['POST']
	# 	print request.args.get('key')
	# 	return "hi"
	# return "hello"

if __name__ == "__main__":
    app.run()
