typescript-today:
	cd $(shell date +%Y) && cd day$(shell date +%d) && ts-node *.ts

python-today:
	cd $(shell date +%Y) && cd day$(shell date +%d) && python3 *.py

typescript:
	cd $(year) && cd day$(day) && ts-node *.ts

python:
	cd $(year) && cd day$(day) && python3 *.py
