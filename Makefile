install:
	cd desk-ui && npm install
	cd ../server && pip install -r requirements.txt

run:
	cd desk-ui && nohup npm run dev > desk-ui.log 2>&1 &
	cd server && nohup uvicorn main:app --reload > server.log 2>&1 &

kill:
	pkill -f "npm run dev"
	pkill -f "uvicorn main:app --reload"
